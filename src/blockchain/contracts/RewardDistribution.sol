// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IBookManagement {
    struct Book {
        uint256 id;
        uint256 views;
        string ipfsCid;
        address owner;
    }

    function getBookDetails() external view returns (Book[] memory);
    function resetViews() external;
}

interface ISubscriptionNFT {
    function withdraw() external;
}

/// @title RewardDistribution
/// @notice This contract manages the distribution of rewards to book authors based on their book views
/// @dev Inherits from Ownable and ReentrancyGuard for access control and security
contract RewardDistribution is Ownable, ReentrancyGuard {
    IBookManagement public bookManagement;
    ISubscriptionNFT public subscriptionNFT;

    /// @notice Emitted when rewards are distributed
    /// @param totalRewards The total amount of rewards distributed
    event RewardsDistributed(uint256 totalRewards);

    /// @notice Initializes the contract with book management and subscription NFT addresses
    /// @param _bookManagement Address of the BookManagement contract
    /// @param _subscriptionNFT Address of the SubscriptionNFT contract
    constructor(address _bookManagement, address _subscriptionNFT) Ownable(msg.sender) {
        bookManagement = IBookManagement(_bookManagement);
        subscriptionNFT = ISubscriptionNFT(_subscriptionNFT);
    }

    /// @notice Distributes rewards to book authors based on their book views
    /// @dev Only the owner can call this function. It's protected against reentrancy.
    function distributeRewards() external onlyOwner nonReentrant {
        // Withdraw funds from SubscriptionNFT
        subscriptionNFT.withdraw();

        uint256 totalRewards = address(this).balance;
        require(totalRewards > 0, "No rewards to distribute");

        uint256 rewardsForAuthors = totalRewards;

        // Get book details
        IBookManagement.Book[] memory books = bookManagement.getBookDetails();

        // Calculate total views
        uint256 totalViews = 0;
        for (uint256 i = 0; i < books.length; i++) {
            totalViews += books[i].views;
        }

        require(totalViews > 0, "No views recorded");

        // Distribute rewards to authors
        for (uint256 i = 0; i < books.length; i++) {
            if (books[i].views > 0) {
                uint256 authorReward = (rewardsForAuthors * books[i].views) / totalViews;
                payable(books[i].owner).transfer(authorReward);
            }
        }

        // Transfer remaining rewards to platform owner
        payable(owner()).transfer(address(this).balance);

        // Reset views
        bookManagement.resetViews();

        emit RewardsDistributed(totalRewards);
    }

    /// @notice Allows the contract to receive Ether
    receive() external payable {}
}