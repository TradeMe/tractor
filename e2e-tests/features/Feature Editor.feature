Feature: Feature Editor
  In order to test the behavior of Feature Page
  As a user of tractor
  I want test the components on Feature Page
  Scenario: able to see run feature button when a feature is selected
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I select the Feature Editor link
    And I select a feature from file tree
    Then run feature button is present
  Scenario: able to see run feature button when feature is selected using partial Text selector
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I select the Feature Editor link
    And I select a feature from file tree
    Then run feature button is located using partial Text locator