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
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('GambiaNewUiLinkController', function() {

    beforeEach(function() {
        var context = this;
        module('gambia-new-ui-link', function($provide) {
            context.$window = {
                location: {
                    assign: jasmine.createSpy('assign')
                }
            };
            $provide.value('$window', context.$window);
            $provide.constant('NEW_UI_URL', '/v2/');
        });

        inject(function($injector) {
            this.vm = $injector.get('$controller')('GambiaNewUiLinkController');
        });
    });

    it('should expose the new UI url', function() {
        expect(this.vm.url).toEqual('/v2/');
    });

    it('should navigate to the new UI on open', function() {
        this.vm.open();

        expect(this.$window.location.assign).toHaveBeenCalledWith('/v2/');
    });

});
