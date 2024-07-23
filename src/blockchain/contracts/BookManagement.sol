// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title BookManagement
/// @notice This contract manages book uploads and subscriptions
/// @dev Inherits from AccessControl, ReentrancyGuard, and Pausable for enhanced security
contract BookManagement is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VIEW_RESETER_ROLE = keccak256("VIEW_RESETER_ROLE");

    /// @notice Public key for the platform
    string public constant PLATFORM_PUBLIC_KEY = "04e051d1bfe5877cc3357b20ded137b1050dc8be9f12e4e97ba86da2f578d1eeefeb10e6d6952afe337272a08e5d2799d1ca96838f4294c9fcbf6e45c9fc7b6116";

    /// @notice Structure to represent a book
    struct Book {
        uint256 id;
        uint256 views;
        string ipfsCid;
        address owner;
    }
    /// @notice Mapping of book IDs to Book structs
    mapping(uint256 => Book) public books;

    /// @notice Counter for book IDs
    Counters.Counter private _bookIdCounter;

    /// @notice Event emitted when a book is uploaded
    /// @param bookId The ID of the uploaded book
    /// @param owner The address of the book owner
    event BookUploaded(uint256 indexed bookId, address indexed owner);

    /// @notice Event emitted when a book's views are increased
    /// @param bookId The ID of the book
    /// @param newViews The updated number of views
    event BookViewsIncreased(uint256 indexed bookId, uint256 newViews);

    /// @notice Constructor to initialize the contract
    /// @dev Sets up initial roles
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Uploads a new book
    /// @param _ipfsCid The IPFS CID of the book
    /// @dev Only callable by users with ADMIN_ROLE when not paused
    function uploadBook(string memory _ipfsCid) 
        public 
        onlyRole(ADMIN_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(bytes(_ipfsCid).length > 0, "IPFS CID cannot be empty");

        uint256 newBookId = _bookIdCounter.current();
        _bookIdCounter.increment();

        books[newBookId] = Book({
            id: newBookId,
            views: 0,
            ipfsCid: _ipfsCid,
            owner: msg.sender
        });

        emit BookUploaded(newBookId, msg.sender);
    }

    /// @notice Retrieves details of all books
    /// @return An array of Book structs
    function getBookDetails() 
        public 
        view 
        returns (Book[] memory) 
    {
        uint256 totalBooks = _bookIdCounter.current();
        Book[] memory allBooks = new Book[](totalBooks);

        for (uint256 i = 0; i < totalBooks; i++) {
            allBooks[i] = books[i];
        }

        return allBooks;
    }

    /// @notice Increases the view count for a specific book
    /// @param id The ID of the book
    /// @dev Only callable by users with ADMIN_ROLE when not paused
    function increaseView(uint256 id) 
        external 
        onlyRole(ADMIN_ROLE)
        whenNotPaused
    {
        books[id].views++;
        emit BookViewsIncreased(id, books[id].views);
    }

    /// @notice Resets views for all books
    /// @dev Only callable by users with BOOK_RESETER_ROLE
    function resetViews() 
        external 
        onlyRole(VIEW_RESETER_ROLE) 
    {
        uint256 totalBooks = _bookIdCounter.current();
        for (uint256 i = 0; i < totalBooks; i++) {
            books[i].views = 0;
        }
    }

    /// @notice Pauses the contract
    /// @dev Can only be called by users with ADMIN_ROLE
    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpauses the contract
    /// @dev Can only be called by users with ADMIN_ROLE
    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}