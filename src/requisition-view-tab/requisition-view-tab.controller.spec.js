/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

describe('ViewTabController (supplying-facility stock)', function() {

    beforeEach(function() {
        module('requisition-view-tab');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.scope = this.$rootScope.$new();
        });

        this.messageService = {
            get: jasmine.createSpy('messageServiceGet').andCallFake(function(key) {
                return key;
            })
        };

        var spec = this;
        this.initController = function(requisition, lineItems, columns, canApproveAndReject) {
            var vm = spec.$controller('ViewTabController', {
                $filter: function() {
                    return function() {
                        return [];
                    };
                },
                selectProductsModalService: {},
                requisitionValidator: {
                    isLineItemValid: function() {}
                },
                requisition: requisition,
                columns: columns || [],
                messageService: spec.messageService,
                lineItems: lineItems,
                alertService: {},
                canSubmit: false,
                canAuthorize: false,
                fullSupply: false,
                TEMPLATE_COLUMNS: {
                    getTbMonthlyColumns: function() {
                        return [];
                    }
                },
                $q: spec.$q,
                OpenlmisArrayDecorator: function() {},
                canApproveAndReject: canApproveAndReject === undefined ? true : canApproveAndReject,
                items: lineItems,
                paginationService: {
                    registerList: function() {
                        return {
                            then: function() {}
                        };
                    }
                },
                $stateParams: {},
                requisitionCacheService: {},
                canUnskipRequisitionItemWhenApproving: false,
                program: {
                    name: 'family-planning'
                },
                TB_MONTHLY_PROGRAM: 'TB Monthly',
                $scope: spec.scope
            });
            vm.$onInit();
            return vm;
        };

        this.requisition = function(overrides, columnDisplayed) {
            var requisition = angular.extend({
                emergency: false
            }, overrides);
            requisition.template = {
                hasSkipColumn: function() {
                    return false;
                },
                hideSkippedLineItems: function() {
                    return false;
                },
                columnsMap: {
                    supplyingFacilityStockOnHand: {
                        isDisplayed: columnDisplayed !== false
                    }
                },
                getColumn: function(name) {
                    return this.columnsMap[name];
                }
            };
            return requisition;
        };
    });

    describe('header', function() {

        it('should read "not configured" when there are no supplying facilities', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: null
                }),
                [{
                    supplyingFacilityStockOnHand: undefined,
                    approvedQuantity: 5
                }]
            );

            expect(vm.supplyingFacilityHasStock).toBe(false);
            expect(vm.supplyingFacilityHeader).toBe('requisitionViewTab.supplyingFacility.notConfigured');
        });

        it('should read "stock unavailable" when facilities exist but no line has stock on hand', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                [{
                    supplyingFacilityStockOnHand: undefined,
                    approvedQuantity: 5
                }, {
                    supplyingFacilityStockOnHand: null,
                    approvedQuantity: 2
                }]
            );

            expect(vm.supplyingFacilityHasStock).toBe(false);
            expect(vm.supplyingFacilityHeader).toBe('requisitionViewTab.supplyingFacility.stockUnavailable');
        });

        it('should read the facility name when at least one line has stock on hand', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }, {
                        name: 'Regional Medical Stores'
                    }]
                }),
                [{
                    supplyingFacilityStockOnHand: 10,
                    approvedQuantity: 5
                }]
            );

            expect(vm.supplyingFacilityHasStock).toBe(true);
            expect(vm.supplyingFacilityHeader).toBe('requisitionViewTab.supplyingFacility.name');
            expect(this.messageService.get).toHaveBeenCalledWith(
                'requisitionViewTab.supplyingFacility.name',
                {
                    facilities: 'Central Medical Stores, Regional Medical Stores'
                }
            );
        });
    });

    describe('column and banner visibility', function() {

        it('should show the column when enabled for an approver with access', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                [{
                    supplyingFacilityStockOnHand: 10,
                    approvedQuantity: 5
                }]
            );

            expect(vm.showSupplyingFacilitySoh).toBe(true);
            expect(vm.showSupplyingFacilityBanner).toBe(false);
        });

        it('should show the banner and hide the column when access is denied', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilityAccessDenied: true,
                    supplyingFacilities: null
                }),
                []
            );

            expect(vm.showSupplyingFacilitySoh).toBe(false);
            expect(vm.showSupplyingFacilityBanner).toBe(true);
        });

        it('should hide the column and banner when the template column is disabled', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }, false),
                [{
                    supplyingFacilityStockOnHand: 10,
                    approvedQuantity: 5
                }]
            );

            expect(vm.showSupplyingFacilitySoh).toBe(false);
            expect(vm.showSupplyingFacilityBanner).toBe(false);
        });

        it('should hide the column and banner for a user who cannot approve', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                [{
                    supplyingFacilityStockOnHand: 10,
                    approvedQuantity: 5
                }],
                [],
                false
            );

            expect(vm.showSupplyingFacilitySoh).toBe(false);
            expect(vm.showSupplyingFacilityBanner).toBe(false);
        });

        it('should not show the banner when access is denied but the column is disabled', function() {
            var vm = this.initController(
                this.requisition({
                    supplyingFacilityAccessDenied: true,
                    supplyingFacilities: null
                }, false),
                []
            );

            expect(vm.showSupplyingFacilitySoh).toBe(false);
            expect(vm.showSupplyingFacilityBanner).toBe(false);
        });

        it('should drop the generic supplyingFacilityStockOnHand column from the rendered columns', function() {
            var columns = [{
                name: 'stockOnHand'
            }, {
                name: 'supplyingFacilityStockOnHand'
            }, {
                name: 'approvedQuantity'
            }];
            var lineItems = [{
                supplyingFacilityStockOnHand: 10,
                approvedQuantity: 5,
                updateFieldValue: function() {}
            }];

            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                lineItems,
                columns
            );

            var names = vm.columns.map(function(column) {
                return column.name;
            });

            expect(names).toEqual(['stockOnHand', 'approvedQuantity']);
        });
    });

    describe('isSupplyingFacilityShortfall', function() {

        beforeEach(function() {
            this.lineItems = [{
                supplyingFacilityStockOnHand: 10,
                approvedQuantity: 5
            }, {
                supplyingFacilityStockOnHand: 3,
                approvedQuantity: 8
            }, {
                supplyingFacilityStockOnHand: 0,
                approvedQuantity: 1
            }, {
                supplyingFacilityStockOnHand: undefined,
                approvedQuantity: 2
            }];

            this.vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                this.lineItems
            );
        });

        it('should not highlight when approved quantity is within stock on hand', function() {
            expect(this.vm.isSupplyingFacilityShortfall(this.lineItems[0])).toBe(false);
        });

        it('should highlight when approved quantity exceeds stock on hand', function() {
            expect(this.vm.isSupplyingFacilityShortfall(this.lineItems[1])).toBe(true);
        });

        it('should highlight a positive approved quantity against zero stock on hand', function() {
            expect(this.vm.isSupplyingFacilityShortfall(this.lineItems[2])).toBe(true);
        });

        it('should treat an absent stock on hand as zero and highlight a positive approved quantity', function() {
            expect(this.vm.isSupplyingFacilityShortfall(this.lineItems[3])).toBe(true);
        });

        it('should not highlight any line when no line has stock on hand', function() {
            var lineItems = [{
                supplyingFacilityStockOnHand: undefined,
                approvedQuantity: 100
            }];
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                lineItems
            );

            expect(vm.supplyingFacilityHasStock).toBe(false);
            expect(vm.isSupplyingFacilityShortfall(lineItems[0])).toBe(false);
        });

        it('should not highlight when approved quantity equals stock on hand', function() {
            expect(this.vm.isSupplyingFacilityShortfall({
                supplyingFacilityStockOnHand: 5,
                approvedQuantity: 5
            })).toBe(false);
        });

        it('should recompute the shortfall after the approved quantity changes', function() {
            var lineItem = {
                supplyingFacilityStockOnHand: 10,
                approvedQuantity: 5
            };
            var vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                [lineItem]
            );

            expect(vm.isSupplyingFacilityShortfall(lineItem)).toBe(false);

            lineItem.approvedQuantity = 20;

            expect(vm.isSupplyingFacilityShortfall(lineItem)).toBe(true);
        });
    });

    describe('getSupplyingFacilityStockOnHand', function() {

        beforeEach(function() {
            this.vm = this.initController(
                this.requisition({
                    supplyingFacilities: [{
                        name: 'Central Medical Stores'
                    }]
                }),
                [{
                    supplyingFacilityStockOnHand: 10,
                    approvedQuantity: 5
                }]
            );
        });

        it('should return the numeric value when present', function() {
            expect(this.vm.getSupplyingFacilityStockOnHand({
                supplyingFacilityStockOnHand: 7
            })).toBe(7);
        });

        it('should return zero as zero', function() {
            expect(this.vm.getSupplyingFacilityStockOnHand({
                supplyingFacilityStockOnHand: 0
            })).toBe(0);
        });

        it('should return the placeholder when the value is absent', function() {
            expect(this.vm.getSupplyingFacilityStockOnHand({
                supplyingFacilityStockOnHand: undefined
            })).toBe('requisitionViewTab.supplyingFacility.placeholder');
        });

        it('should return the placeholder when the value is null', function() {
            expect(this.vm.getSupplyingFacilityStockOnHand({
                supplyingFacilityStockOnHand: null
            })).toBe('requisitionViewTab.supplyingFacility.placeholder');
        });
    });
});
