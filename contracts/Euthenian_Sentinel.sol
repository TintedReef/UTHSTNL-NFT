//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Euthenian_Sentinel is ERC721, Ownable{

    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    bool public permitBurn;
    bool public permitMint;
    uint8 public royaltyFeesInPercentage;
    uint32 public maxTokenSupply;
    uint32 public tokenSupply;
    address public royaltyAddress;
    string public baseURI;
    uint public priceBuyToken;

//Enum

    enum PresaleState {initialRelease, firstRelease, secondRelease}
    PresaleState public presaleState;

//Event

    event MINT(address _user, uint _tokenID);
    event BURN(address _user, uint _tokenID);

    event changeRoyaltyFeesInPercentage(uint8 _lastRoyaltyFeesInPercentage, uint8 _newRoyaltyFeesInPercentage);
    event changeRoyaltyAddress(address _lastRoyaltyAddress, address _newRoyaltyAddress);
    event changeBaseURI(string _lastBaseURI, string _newBaseURI);
    event changePriceBuyToken(uint _lastPriceBuyToken, uint _newPriceBuyToken);
    event changePermitBurn(bool _state);
    event changePermitMint(bool _state);

    event _withdrawMoney(address _user, uint _amount, uint _date);

//Modifier

    ///@dev Check if Nft can be burned
    modifier checkBurn() {
        require(permitBurn, "Error: Burn Function are inactive" );
        _;
    }

    ///@dev Check if Nft can be minted
    modifier checkMint() {
        require(permitMint, "Error: Mint Function are inactive" );
        _;
    }

//Constructor

    /**
        @param _name Collection Name
        @param _symbol Collection Symbol
        @param _baseURI ISPF URL
        @param _royaltyAddress Address where the royalties will be sent
    */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI, 
        address _royaltyAddress
    ) ERC721(_name, _symbol){

        presaleState = PresaleState.initialRelease;

        priceBuyToken = 0.1 ether;
        maxTokenSupply = 4000;
        royaltyFeesInPercentage = 10;

        baseURI = _baseURI;
        royaltyAddress = _royaltyAddress;
    }

//Override Functions

    ///@dev Returns the custom ISPF URL of each token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);

        string memory _baseURI = baseURI;
        return bytes(_baseURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenId.toString(), ".json")) : "";
    }

//Public Functions

    ///@notice Function that allows users to mint NFT, the user must pay an amount for each NFT
    function mint(uint _amountForMint) public payable checkMint() {
        require(
            _amountForMint > 0, 
            "Error: Need to mint at least one token"
        );
        require(
            (tokenSupply + _amountForMint) <= maxTokenSupply, 
            "Error: No can mint more token"
        );
        
        uint _priceBuy = priceBuyToken * _amountForMint;
        require(
            msg.value >= _priceBuy, 
            "Error: No enough money for buy"
        );

        for( uint i = 0; i < _amountForMint; i++){

            uint256 _newItemId = _tokenIds.current();
            _mint(msg.sender, _newItemId);

            tokenSupply++;
            _tokenIds.increment();

            emit MINT(msg.sender, _newItemId);
        }

        if(msg.value > _priceBuy){

            uint _moneyToReturn = msg.value - _priceBuy;
            (bool success,) = msg.sender.call{ value: _moneyToReturn }("");
            require(
                success, 
                "Error: Refund failed"
            );
        }
    }

    ///@notice Function that allows users, owners or with permissions, to burn NFT
    function burn(uint256 _tokenId) public virtual checkBurn() {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId), 
            "Error: caller is not token owner nor approved"
        );

        _burn(_tokenId);
        tokenSupply--;

        if(presaleState == PresaleState.secondRelease){
            _supplementReadjustment();
        }

        emit BURN(msg.sender, _tokenId);
    }

//View Functions

    ///@notice Returns all the information about the payment of royalties
    function royaltyInfo(uint256 _salePrice) external view virtual returns (address, uint256){
        
        return (royaltyAddress, _calculateRoyalty(_salePrice));
    }

    /**
        @notice Returns the id number of the last minted nft
        @dev The number of the id of the NFT goes from 0 to this number returned
     */
    function nftIdCounter() external view returns(uint){
        return (_tokenIds.current() - 1);
    }

//Only Owner Functions

    /**
        @dev The owner can increase the maximum supplement of the collection based on the stage of launch in which 
        the project is.
    */
    function updateRelease() public onlyOwner {
        require(
            presaleState != PresaleState.secondRelease, 
            "Error: The contract is already in the second stage of launch"
        );

        if(presaleState == PresaleState.initialRelease){

            maxTokenSupply += 3000;
            presaleState = PresaleState.firstRelease;
        }else if(presaleState == PresaleState.firstRelease){

            maxTokenSupply += 3000;
            presaleState = PresaleState.secondRelease;
        }
    }

    ///@dev Allows the owner to modify the fee percentage for royalties
    function setRoyaltyFeesInPercentage(uint8 _newRoyaltyFeesInPercentage) public onlyOwner {
        require(
            (_newRoyaltyFeesInPercentage > 0) && (_newRoyaltyFeesInPercentage < 100), 
            "Error: Invalid percentage"
        );

        uint8 _lastRoyaltyFeesInPercentage = royaltyFeesInPercentage;
        royaltyFeesInPercentage = _newRoyaltyFeesInPercentage;

        emit changeRoyaltyFeesInPercentage(_lastRoyaltyFeesInPercentage, royaltyFeesInPercentage);
    }

    ///@dev Allows the owner to modify the address where the money from the royalty fees will be sent
    function setRoyaltyAddress(address _newRoyaltyAddress) public onlyOwner {
        require( 
            (_newRoyaltyAddress != address(0)) && (_newRoyaltyAddress != royaltyAddress), 
            "Error: Invalid Address"
        );

        address _lastRoyaltyAddress = royaltyAddress;
        royaltyAddress = _newRoyaltyAddress;

        emit changeRoyaltyAddress(_lastRoyaltyAddress, royaltyAddress);
    }

    ///@dev Allows the owner to modify the ISPF base URL for NFTs
    function setBaseUri(string memory _newBaseURI) public onlyOwner {
        
        string memory _lastBaseURI = baseURI;
        baseURI = _newBaseURI;

        emit changeBaseURI(_lastBaseURI, baseURI);
    }

    ///@dev Allows the owner to modify the minting price of NFTs
    function setPriceBuyToken(uint _newPriceBuyToken) public onlyOwner {
        require(
            (_newPriceBuyToken > 0) && (_newPriceBuyToken != priceBuyToken), 
            "Error: The new price is not valid"
        );

        uint _lastPriceBuyToken = priceBuyToken;
        priceBuyToken = _newPriceBuyToken;

        emit changePriceBuyToken(_lastPriceBuyToken, priceBuyToken);
    }

    ///@dev Allows the owner to modify the status of whether or not NFT burning is allowed
    function setPermitBurn(bool _newStateToPermitBurn) public onlyOwner{
        require(
            _newStateToPermitBurn != permitBurn, 
            "Error: The current state is the same as the new"
        );
        
        permitBurn = _newStateToPermitBurn;

        emit changePermitBurn(permitBurn);
    }

    ///@dev Allows the owner to modify the status of whether or not NFT minting is allowed
    function setPermitMint(bool _newStateToPermitMint) public onlyOwner{
        require(
            _newStateToPermitMint != permitMint, 
            "Error: The current state is the same as the new"
        );

        permitMint = _newStateToPermitMint;

        emit changePermitMint(permitMint);
    }

    ///@dev Allows the owner to withdraw the funds from the contract
    function withdrawMoney() public onlyOwner {
        
        uint _contractBlance = address(this).balance;

        if(_contractBlance > 0){

            (bool success, ) = payable(msg.sender).call{value: _contractBlance }("");
            require(success, "Error: Error withdrawing money");

            emit _withdrawMoney(msg.sender, _contractBlance, block.timestamp);
        }
    }

//Internal Functions

    ///@dev Calculate the royalty fee amount based on the sale price
    function _calculateRoyalty(uint256 _salePrice) internal view returns (uint256){
        return (_salePrice * royaltyFeesInPercentage) / 100;
    }

    ///@dev Check if the ID of an NFT has already been minted or not
    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    /**
        @dev Reset nft supplement, when supplement is "<= 5000", minting nft until reaching 6000 nft supplement
    */
    function _supplementReadjustment() internal {

        if(tokenSupply <= 5000){
            uint _amountForMint = 6000 - tokenSupply;
            _mintForOwner(_amountForMint);
        }
    }

    ///@dev Mint nft in the address of the contract owner
    function _mintForOwner(uint _amountForMint) internal {

        for( uint i = 0; i < _amountForMint; i++){

            uint256 _newItemId = _tokenIds.current();
            _mint(owner(), _newItemId);

            tokenSupply++;
            _tokenIds.increment();

            emit MINT(owner(), _newItemId);
        }
    }
}