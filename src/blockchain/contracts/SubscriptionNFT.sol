// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title SubscriptionNFT
/// @notice This contract manages subscription NFTs with different plans and durations
/// @dev Inherits from ERC721 and AccessControl
contract SubscriptionNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    /// @notice Enum representing different subscription plans
    enum SubscriptionPlan { OneMonth, ThreeMonths, SixMonths }

    /// @notice Struct containing subscription details
    struct Subscription {
        SubscriptionPlan plan;
        uint256 expiryTimestamp;
        bool active;
    }

    uint256 public constant PLATFORM_FEE_PERCENTAGE = 25;
    address public immutable PLATFORM;

    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256) public userTokens;

    uint256 public constant ONE_MONTH = 30 days;
    uint256 public constant THREE_MONTHS = 90 days;
    uint256 public constant SIX_MONTHS = 180 days;

    // Prices for each plan in wei
    uint256 public oneMonthPrice = 0.1 ether;
    uint256 public threeMonthsPrice = 0.25 ether;
    uint256 public sixMonthsPrice = 0.45 ether;

    /// @notice Emitted when a new subscription is minted
    /// @param user Address of the user who minted the subscription
    /// @param tokenId ID of the minted token
    /// @param plan Subscription plan chosen
    event SubscriptionMinted(address indexed user, uint256 tokenId, SubscriptionPlan plan);

    /// @notice Emitted when a subscription is renewed
    /// @param user Address of the user who renewed the subscription
    /// @param tokenId ID of the renewed token
    /// @param plan New subscription plan chosen
    event SubscriptionRenewed(address indexed user, uint256 tokenId, SubscriptionPlan plan);

    /// @notice Initializes the contract and sets up roles
    constructor() ERC721("SubscriptionNFT", "SNFT") {
        PLATFORM = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Allows a user to subscribe or renew their subscription
    /// @param plan The subscription plan chosen
    function subscribe(SubscriptionPlan plan) external payable {
        uint256 price = getPlanPrice(plan);
        require(msg.value >= price, "Insufficient payment");

        uint256 tokenId = userTokens[msg.sender];

        if (tokenId == 0) {
            _mintSubscription(plan);
        } else {
            _renewSubscription(tokenId, plan);
        }
        
        // Sending platform fee
        uint256 platformFee = (price * PLATFORM_FEE_PERCENTAGE) / 100;
        payable(PLATFORM).transfer(platformFee);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    /// @notice Internal function to mint a new subscription
    /// @param plan The subscription plan chosen
    function _mintSubscription(SubscriptionPlan plan) internal {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        uint256 expiryTimestamp = block.timestamp + _getPlanDuration(plan);
        subscriptions[newTokenId] = Subscription(plan, expiryTimestamp, true);
        userTokens[msg.sender] = newTokenId;

        emit SubscriptionMinted(msg.sender, newTokenId, plan);
    }

    /// @notice Internal function to renew an existing subscription
    /// @param tokenId ID of the token to renew
    /// @param plan The new subscription plan chosen
    function _renewSubscription(uint256 tokenId, SubscriptionPlan plan) internal {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");

        Subscription storage sub = subscriptions[tokenId];
        uint256 newExpiryTimestamp;

        if (sub.active && sub.expiryTimestamp > block.timestamp) {
            newExpiryTimestamp = sub.expiryTimestamp + _getPlanDuration(plan);
        } else {
            newExpiryTimestamp = block.timestamp + _getPlanDuration(plan);
        }

        sub.plan = plan;
        sub.expiryTimestamp = newExpiryTimestamp;
        sub.active = true;

        emit SubscriptionRenewed(msg.sender, tokenId, plan);
    }

    /// @notice Internal function to get the duration of a plan
    /// @param plan The subscription plan
    /// @return The duration of the plan in seconds
    function _getPlanDuration(SubscriptionPlan plan) internal pure returns (uint256) {
        if (plan == SubscriptionPlan.OneMonth) return ONE_MONTH;
        if (plan == SubscriptionPlan.ThreeMonths) return THREE_MONTHS;
        if (plan == SubscriptionPlan.SixMonths) return SIX_MONTHS;
        revert("Invalid plan");
    }

    /// @notice Gets the price of a subscription plan
    /// @param plan The subscription plan
    /// @return The price of the plan in wei
    function getPlanPrice(SubscriptionPlan plan) public view returns (uint256) {
        if (plan == SubscriptionPlan.OneMonth) return oneMonthPrice;
        if (plan == SubscriptionPlan.ThreeMonths) return threeMonthsPrice;
        if (plan == SubscriptionPlan.SixMonths) return sixMonthsPrice;
        revert("Invalid plan");
    }

    /// @notice Allows an admin to set new prices for subscription plans
    /// @param _oneMonth New price for one month plan
    /// @param _threeMonths New price for three months plan
    /// @param _sixMonths New price for six months plan
    function setPlanPrices(uint256 _oneMonth, uint256 _threeMonths, uint256 _sixMonths) external onlyRole(ADMIN_ROLE) {
        oneMonthPrice = _oneMonth;
        threeMonthsPrice = _threeMonths;
        sixMonthsPrice = _sixMonths;
    }

    /// @notice Checks if a subscription is currently active
    /// @param tokenId The ID of the token to check
    /// @return Boolean indicating if the subscription is active
    function checkSubscriptionStatus(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        Subscription memory sub = subscriptions[tokenId];
        return sub.active && sub.expiryTimestamp > block.timestamp;
    }

    /// @notice Gets the details of a subscription
    /// @param tokenId The ID of the token to check
    /// @return The plan, expiry timestamp, and active status of the subscription
    function getSubscriptionDetails(uint256 tokenId) external view returns (SubscriptionPlan, uint256, bool) {
        require(_exists(tokenId), "Token does not exist");
        Subscription memory sub = subscriptions[tokenId];
        return (sub.plan, sub.expiryTimestamp, sub.active && sub.expiryTimestamp > block.timestamp);
    }

    /// @notice Internal function to check if a token exists
    /// @param tokenId The ID of the token to check
    /// @return Boolean indicating if the token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /// @notice Allows the withdrawer to withdraw the contract's balance
    function withdraw() external onlyRole(WITHDRAWER_ROLE) {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    /// @notice Checks if the contract supports an interface
    /// @param interfaceId The interface identifier to check
    /// @return Boolean indicating if the interface is supported
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}