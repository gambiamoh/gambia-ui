Upcoming Version / WIP
=================

* [OPSD-123](https://openlmis.atlassian.net/browse/OPSD-123): Removed the One Network Integration page from the build; Gambia runs no One Network integration service, so the page could only show an error.
* [OPSD-123](https://openlmis.atlassian.net/browse/OPSD-123): Upgraded to the OpenLMIS 3.20.2 UI modules (referencedata-ui 5.7.1, requisition-ui 7.1.1); the OPSD-124 backport is now covered by core.
* [OPSD-123](https://openlmis.atlassian.net/browse/OPSD-123): Upgraded to the OpenLMIS 3.20 UI modules (reference-ui 5.2.15), rebased the remaining overrides on them, removed overrides now covered by core and aligned the consul registration with the reference UI; a failing health check never removes the UI from Consul.
* [OPSD-124](https://openlmis.atlassian.net/browse/OPSD-124): The supplying-facility stock on hand column no longer shows first in emergency requisitions; it follows its template position there too (backport of the core fix OLMIS-8403).

1.1.3 / 2026-03-25
=================

* [OPSD-87](https://openlmis.atlassian.net/browse/OPSD-87): Reduced maxUriLength to prevent URL length exceeding 2000 characters

1.1.2 / 2025-09-19
=================

* [OPSD-62](https://openlmis.atlassian.net/browse/OPSD-62): Requisitionless Orders: Fixed issue preventing users from completing order creation
* [OPSD-59](https://openlmis.atlassian.net/browse/OPSD-59): Line Item Filters: Fixed issue where the Show Skipped Items filter would reset after a page change

1.1.1 / 2025-05-16
=================

* [OG-101](https://openlmis.atlassian.net/browse/OG-101): Upgraded versions to core's 3.19.1

1.1.0 / 2025-02-13
=================

* Upgraded versions to core's 3.18

1.0.0 / 2024-12-09
=================

* Initial release of the gambia ui
