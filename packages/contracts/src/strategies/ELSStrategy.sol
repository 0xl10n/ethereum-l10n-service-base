// SPDX-License-Identifier: AGPL-3.0-only
/**
* Modified from MicroGrantsBaseStrategy and EAS integration is inspired by ELSStrategy
* Check ELSStrategy.spec.md for information
*/

pragma solidity 0.8.19;
// Internal Libraries

import {MicroGrantsBaseStrategy} from "./MicroGrantsBaseStrategy.sol";
import {
    Attestation, AttestationRequest, AttestationRequestData, IEAS, RevocationRequest
} from "eas-contracts/IEAS.sol";
import {ISchemaRegistry, ISchemaResolver, SchemaRecord} from "eas-contracts/ISchemaRegistry.sol";

contract ELSStrategy is MicroGrantsBaseStrategy {
    struct EASInfo {
        IEAS eas;
        ISchemaRegistry schemaRegistry;
        bytes32 schemaUID;
        string schema;
        bool revocable;
    }

    struct InitializeParamsELS {
        EASInfo easInfo;
        MicroGrantsBaseStrategy.InitializeParams microGrantInitializeParams;
    }

    EASInfo public easInfo;

    /// ======================
    /// ==== Custom Error ====
    /// ======================

    error ALREADY_ADDED();
    error OUT_OF_BOUNDS();
    error INVALID_ATTESTATION();
    error INVALID_SCHEMA();
    
    /// ===============================
    /// ========== Events =============
    /// ===============================

    /// @notice Emitted when an allocator is added
    /// @param allocator The allocator address
    /// @param sender The sender of the transaction
    event AllocatorSet(address indexed allocator, bool indexed _flag, address sender);

    /// ================================
    /// ========== Storage =============
    /// ================================

    /// @notice This maps the recipient to their approval status
    /// @dev 'allocator' => 'bool'
    mapping(address => bool) public allocators;

    // recipientId -> eas attestation uid
    mapping(address => bytes32) public recipientIdToAttestationUID;

    /// ===============================
    /// ======== Constructor ==========
    /// ===============================


    // @notice Initialize the strategy
    // Override the initialize function to include the EASInfo
    /// @dev This will revert if the strategy is already initialized and 'msg.sender' is not the 'Allo' contract.
    /// @param _poolId ID of the pool
    /// @param _data The data to be decoded
    /// @custom:data (bool useRegistryAnchor; uint64 allocationStartTime,
    ///    uint64 allocationEndTime, uint256 approvalThreshold, uint256 maxRequestedAmount), uint256 _hatId
    function initialize(uint256 _poolId, bytes memory _data) external virtual override {
        (InitializeParamsELS memory initializeParamsELS) =
            abi.decode(_data, (InitializeParamsELS));
        __ELSStrategy_init(_poolId, initializeParamsELS);

        emit Initialized(_poolId, _data);
    }
    
    /// @dev Gets an attestation from the EAS contract using the UID
    /// @param uid The UUID of the attestation to get.
    function getAttestation(bytes32 uid) external view returns (Attestation memory) {
        return easInfo.eas.getAttestation(uid);
    }

    /// @notice Returns if the attestation exists & not expiered
    /// @param uid The attestation UID to check
    function isAttestationVerified(bytes32 uid) external view returns (bool) {
        if (easInfo.eas.getAttestation(uid).expirationTime < block.timestamp) {
            return true;
        }
        return false;
    }


    /// @dev Initializes the strategy.
    // @solhint disable-next-line func-name-mixedcase
    function __ELSStrategy_init(uint256 _poolId, InitializeParamsELS memory _initializeParams) internal {
        // overwrite the review threshold and registry gating

        // __SchemaResolver_init(_initializeParams.easInfo.eas);

        easInfo = EASInfo({
            eas: _initializeParams.easInfo.eas,
            schemaRegistry: _initializeParams.easInfo.schemaRegistry,
            schema: _initializeParams.easInfo.schema,
            schemaUID: _initializeParams.easInfo.schemaUID,
            revocable: _initializeParams.easInfo.revocable
        });

        __MicroGrants_init(_poolId, _initializeParams.microGrantInitializeParams);

        // register / validate SchemaRecord
        if (bytes(easInfo.schema).length > 0) {
            // if the schema is present, then register schema and update uid
            easInfo.schemaUID =
                easInfo.schemaRegistry.register(easInfo.schema, ISchemaResolver(address(this)), easInfo.revocable);
        } else {
            // compare SchemaRecord to data passed in
            SchemaRecord memory record = easInfo.schemaRegistry.getSchema(easInfo.schemaUID);
            if (
                record.uid != easInfo.schemaUID || record.revocable != easInfo.revocable
                    || keccak256(abi.encode(record.schema)) != keccak256(abi.encode(easInfo.schema))
            ) {
                revert INVALID_SCHEMA();
            }
        }
    }

    /// @notice Constructor for the Donation Voting Merkle Distribution Strategy
    /// @param _allo The 'Allo' contract
    /// @param _name The name of the strategy
    constructor(address _allo, string memory _name) MicroGrantsBaseStrategy(_allo, _name) {}

    /// ===============================
    /// ======= External/Custom =======
    /// ===============================

    /// @notice Add allocator array
    /// @dev Only the pool manager(s) can call this function and emits an `AllocatorAdded` event
    /// @param _allocators The allocator address array
    /// @param _flags The flag array to set
    function batchSetAllocator(address[] memory _allocators, bool[] memory _flags)
        external
        onlyPoolManager(msg.sender)
    {
        uint256 length = _allocators.length;
        for (uint256 i = 0; i < length;) {
            _setAllocator(_allocators[i], _flags[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Set allocator
    /// @dev Only the pool manager(s) can call this function and emits an `AllocatorSet` event
    /// @param _allocator The allocators address
    /// @param _flag The flag to set
    function setAllocator(address _allocator, bool _flag) external onlyPoolManager(msg.sender) {
        _setAllocator(_allocator, _flag);
    }

    /// ====================================
    /// ============ Internal ==============
    /// ====================================

    /// @notice Checks if address is valid allocator.
    /// @param _allocator The allocator address
    /// @return Returns true is allocator is in mapping
    function _isValidAllocator(address _allocator) internal view override returns (bool) {
        return allocators[_allocator];
    }

    /// @notice Remove allocator
    /// @dev Only the pool manager(s) can call this function and emits an `AllocatorSet` event
    /// @param _allocator The allocator address
    function _setAllocator(address _allocator, bool _flag) internal {
        allocators[_allocator] = _flag;
        emit AllocatorSet(_allocator, _flag, msg.sender);
    }

    /// @notice Hook called before allocation to check if the sender is an allocator
    /// @param _sender The sender of the transaction
    function _beforeAllocate(bytes memory, address _sender) internal view override {
        if (!allocators[_sender]) revert UNAUTHORIZED();
    }

    function setAllowedRecipientIds(
        address[] memory _recipientIds,
        bytes32[] memory _attestationUIDs)
        external
        onlyPoolManager(msg.sender)
    {
        uint256 recipientLength = _recipientIds.length;
        for (uint256 i; i < recipientLength;) {
            address recipientId = _recipientIds[i];
            bytes32 attestationUID = _attestationUIDs[i];
            if (recipientIdToAttestationUID[recipientId] != 0) {
                revert ALREADY_ADDED();
            }

            bool isVerified = this.isAttestationVerified(attestationUID);

            if (isVerified) {
                revert INVALID_ATTESTATION();
            }
            recipientIdToAttestationUID[recipientId] = attestationUID;

            unchecked {
                i++;
            }
        }
    }

}
