# Euthenian Sentinel

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### permitBurn

```solidity
bool permitBurn
```

### permitMint

```solidity
bool permitMint
```

### royaltyFeesInPercentage

```solidity
uint8 royaltyFeesInPercentage
```

### maxTokenSupply

```solidity
uint32 maxTokenSupply
```

### tokenSupply

```solidity
uint32 tokenSupply
```

### royaltyAddress

```solidity
address royaltyAddress
```

### baseURI

```solidity
string baseURI
```

### priceBuyToken

```solidity
uint256 priceBuyToken
```

### PresaleState

```solidity
enum PresaleState {
  initialRelease,
  firstRelease,
  secondRelease
}
```

### presaleState

```solidity
enum Euthenian_Sentinel.PresaleState presaleState
```

### MINT

```solidity
event MINT(address _user, uint256 _tokenID)
```

### BURN

```solidity
event BURN(address _user, uint256 _tokenID)
```

### changeRoyaltyFeesInPercentage

```solidity
event changeRoyaltyFeesInPercentage(uint8 _lastRoyaltyFeesInPercentage, uint8 _newRoyaltyFeesInPercentage)
```

### changeRoyaltyAddress

```solidity
event changeRoyaltyAddress(address _lastRoyaltyAddress, address _newRoyaltyAddress)
```

### changeBaseURI

```solidity
event changeBaseURI(string _lastBaseURI, string _newBaseURI)
```

### changePriceBuyToken

```solidity
event changePriceBuyToken(uint256 _lastPriceBuyToken, uint256 _newPriceBuyToken)
```

### changePermitBurn

```solidity
event changePermitBurn(bool _state)
```

### changePermitMint

```solidity
event changePermitMint(bool _state)
```

### _withdrawMoney

```solidity
event _withdrawMoney(address _user, uint256 _amount, uint256 _date)
```

## checkBurn

```solidity
modifier checkBurn()
```

_Check if Nft can be burned_

## checkMint

```solidity
modifier checkMint()
```

_Check if Nft can be minted_

## constructor

```solidity
constructor(string _name, string _symbol, string _baseURI, address _royaltyAddress) public
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _name | string | Collection Name |
| _symbol | string | Collection Symbol  |
| _baseURI | string | ISPF URL |
| _royaltyAddress | address | Address where the royalties will be sent |

## tokenURI

```solidity
function tokenURI(uint256 tokenId) public view returns (string)
```

_Returns the custom ISPF URL of each token_

## mint

```solidity
function mint(uint256 _amountForMint) public payable
```

Function that allows users to mint NFT, the user must pay an amount for each NFT

## burn

```solidity
function burn(uint256 _tokenId) public virtual
```

Function that allows users, owners or with permissions, to burn NFT

## royaltyInfo

```solidity
function royaltyInfo(uint256 _salePrice) external view virtual returns (address, uint256)
```

Returns all the information about the payment of royalties

## nftIdCounter

```solidity
function nftIdCounter() external view returns (uint256)
```

Returns the id number of the last minted nft
        @dev The number of the id of the NFT goes from 0 to this number returned

## updateRelease

```solidity
function updateRelease() public
```

_The owner can increase the maximum supplement of the collection based on the stage of launch in which 
        the project is._

## setRoyaltyFeesInPercentage

```solidity
function setRoyaltyFeesInPercentage(uint8 _newRoyaltyFeesInPercentage) public
```

_Allows the owner to modify the fee percentage for royalties_

## setRoyaltyAddress

```solidity
function setRoyaltyAddress(address _newRoyaltyAddress) public
```

_Allows the owner to modify the address where the money from the royalty fees will be sent_

## setBaseUri

```solidity
function setBaseUri(string _newBaseURI) public
```

_Allows the owner to modify the ISPF base URL for NFTs_

## setPriceBuyToken

```solidity
function setPriceBuyToken(uint256 _newPriceBuyToken) public
```

_Allows the owner to modify the minting price of NFTs_

## setPermitBurn

```solidity
function setPermitBurn(bool _newStateToPermitBurn) public
```

_Allows the owner to modify the status of whether or not NFT burning is allowed_

## setPermitMint

```solidity
function setPermitMint(bool _newStateToPermitMint) public
```

_Allows the owner to modify the status of whether or not NFT minting is allowed_

## withdrawMoney

```solidity
function withdrawMoney() public
```

_Allows the owner to withdraw the funds from the contract_

## _calculateRoyalty

```solidity
function _calculateRoyalty(uint256 _salePrice) internal view returns (uint256)
```

_Calculate the royalty fee amount based on the sale price_

## _requireMinted

```solidity
function _requireMinted(uint256 tokenId) internal view virtual
```

_Check if the ID of an NFT has already been minted or not_

## _supplementReadjustment

```solidity
function _supplementReadjustment() internal
```

_Reset nft supplement, when supplement is "<= 5000", minting nft until reaching 6000 nft supplement_

## _mintForOwner

```solidity
function _mintForOwner(uint256 _amountForMint) internal
```

_Mint nft in the address of the contract owner_

