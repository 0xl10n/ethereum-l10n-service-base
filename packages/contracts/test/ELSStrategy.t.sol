// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ELSStrategy} from "../src/strategies/ELSStrategy.sol";
import {AlloSetup} from "../src/shared/AlloSetup.sol";
import {
    Attestation, AttestationRequest, AttestationRequestData, IEAS, RevocationRequest
} from "eas-contracts/IEAS.sol";
import {ISchemaRegistry, ISchemaResolver, SchemaRecord} from "eas-contracts/ISchemaRegistry.sol";
// Mocks
import {MockEAS, MockSchemaRegistry} from "../src/utils/MockEAS.sol";
import {AlloSetup} from "../src/shared/AlloSetup.sol";
import {RegistrySetupFull} from "../src/shared/RegistrySetup.sol";
// import {Errors} from "../src/contracts/core/libraries/Errors.sol";
import {Metadata} from "../src/core/libraries/Metadata.sol";
import {Native} from "../src/core/libraries/Native.sol";
// Test libraries

import {IStrategy} from "../src/core/interfaces/IStrategy.sol";
import {MicroGrantsBaseStrategy} from "../src/strategies/MicroGrantsBaseStrategy.sol";
// import {EventSetup} from "../src/shared/EventSetup.sol";


//  Native, EventSetup, Errors 
contract ELSStrategyTest is Test, RegistrySetupFull, AlloSetup, Native {
    // ELSStrategy public strategy;

    ISchemaRegistry public schemaRegistry;
    ELSStrategy.EASInfo public easInfo;
    IEAS public eas;
    

    bool public useRegistryAnchor;

    uint64 public allocationStartTime;
    uint64 public allocationEndTime;

    uint256 public maxRequestedAmount;
    uint256 public approvalThreshold;

    Metadata public poolMetadata;

    bytes32 public constant _NO_RELATED_ATTESTATION_UID = 0;

    function __registerRecipient(IStrategy strategy, address recipient) internal returns (address recipientId) {
        // address sender = pool_manager1();
        address sender = profile1_member1();
        Metadata memory metadata = Metadata({protocol: 1, pointer: "metadata"});

        bytes memory data = abi.encode(profile1_anchor(), recipient, 1e18, metadata);
        
        recipientId = strategy.registerRecipient(data, sender);
    }

    // helper util from HackathonQVStrategy
    function _grantEASAttestation(address _recipientId, uint64 _expirationTime, bytes memory _data, uint256 _value)
        internal
        returns (bytes32)
    {
        AttestationRequest memory attestationRequest = AttestationRequest(
            easInfo.schemaUID,
            AttestationRequestData({
                recipient: _recipientId,
                expirationTime: _expirationTime,
                revocable: easInfo.revocable,
                refUID: _NO_RELATED_ATTESTATION_UID,
                data: _data,
                value: _value
            })
        );

        return easInfo.eas.attest(attestationRequest);
    }


    function setUp() public {
        eas = IEAS(address(new MockEAS()));
        schemaRegistry = ISchemaRegistry(address(new MockSchemaRegistry()));

        // TODO integrate latest schema        
        easInfo = ELSStrategy.EASInfo({
            eas: eas,
            schemaRegistry: schemaRegistry,
            schemaUID: 0,
            schema: "idk",
            revocable: false
        });

        __RegistrySetupFull();
        __AlloSetup(address(registry()));

        useRegistryAnchor = true;
        allocationStartTime = uint64(block.timestamp);
        allocationEndTime = uint64(block.timestamp + 1 days);
        maxRequestedAmount = 1e18;
        // set threshold as 1 to simplify
        approvalThreshold = 1;

        poolMetadata = Metadata({protocol: 1, pointer: "PoolMetadata"});
        
        // _strategy = _createStrategy();
        // _initialize();

         //strategy = new ELSStrategy();

    }

    function alice() public virtual returns (address) {
        return makeAddr("alice");
    }

    // function pool_admin() public virtual returns (address) {
    //     return makeAddr("pool_admin");
    // }


    // function test_SetAllocator() public {
    //     //strategy.setAllocator();
    // }

    function test_contract_deployment() public {
    }
    
    function test_setAllowedRecipientIds() public {
        vm.startPrank(pool_admin());

        emit log_address(alice()); 

        ELSStrategy.InitializeParams memory microGrantInitializeParams = MicroGrantsBaseStrategy.InitializeParams(
            useRegistryAnchor,
            allocationStartTime,
            allocationEndTime,
            approvalThreshold,
            maxRequestedAmount
        );

        /**
         * Initialize the strategy
         */

        ELSStrategy strategy = new ELSStrategy(address(allo()), "MockStrategy");
        uint256 poolId = allo().createPoolWithCustomStrategy(
            poolProfile_id(),
            address(strategy),
            abi.encode(
                ELSStrategy.InitializeParamsELS(
                    easInfo,
                    microGrantInitializeParams
                )
            ),
            NATIVE,
            0 ether,
            poolMetadata,
            pool_managers()
        );


        ELSStrategy newStrategy = ELSStrategy(payable(address(allo().getPool(poolId).strategy)));

        // TODO synchronize this with schema
        bytes memory aesData = abi.encode("attestation data");

        address[] memory recipients = new address[](1);
        recipients[0] = profile1_anchor();

        bytes32[] memory attestationUIDs = new bytes32[](1);
        attestationUIDs[0] = _grantEASAttestation(profile1_anchor(), uint64(allocationEndTime + 30 days), aesData, 0);

        // from allo
        vm.startPrank(address(allo()));
        __registerRecipient(newStrategy, recipients[0]);

        // use strategy to add with attestation 
        vm.startPrank(address(pool_admin()));

        vm.deal(pool_admin(), 1e19);
        allo().fundPool{value: 1e19}(poolId, 1e19);

        newStrategy.setAllowedRecipientIds(recipients, attestationUIDs);
        vm.stopPrank();

        assertTrue(newStrategy.recipientIdToAttestationUID(profile1_anchor()) != bytes32(0));

        bytes memory allocationData = abi.encode(recipients[0], IStrategy.Status.Accepted);


        vm.prank(pool_admin());
        newStrategy.setAllocator(profile1_member1(), true);

        vm.prank(profile1_member1());
        allo().allocate(poolId, allocationData);

        // test payout
        ELSStrategy.PayoutSummary[] memory payouts = newStrategy.getPayouts(recipients,  new bytes[](1));

        assertTrue(payouts.length == 1);


        assertTrue(strategy.allocated(profile1_member1(), recipients[0]));

        /**
         * Check receipent got the $
         * payout completed
         */
         
        assertTrue(recipients[0].balance == 1e18);
        assertTrue(payouts[0].recipientAddress == recipients[0]);
        assertTrue(payouts[0].amount == 0);

    }

    // function testRevert_setAllowedRecipientIds_ALREADY_ADDED() public {
    //     vm.expectRevert(ELSStrategy.ALREADY_ADDED.selector);
    //     // setAllowedRecipientIds();
    // }
}
