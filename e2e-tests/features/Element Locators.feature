Feature: Element Locators
  In order to find out element locator works
  As a user of tractor
  I want test the element locator
  Scenario: able to select element by linkText
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I select the Component Editor using linkText
    Then I assert that I am on Component Page