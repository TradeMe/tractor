
Feature: Page Object file
  In order to describe a part of a web application
  As a tractor user
  I want to be able to manipulate Page Object files

Scenario: Create Page Object file
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Page object"
    Then the file tree should have a file with name="Page object"
    And the file tree should show that the file with name="Page object" is unused
    When I open the Page Object with name="Page object"
    Then the Page Object should have name="Page object"

Scenario: Rename Page Object file
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Should be renamed"
    And I rename the Page Object with name="Should be renamed" to newName="Changed"
    Then the file tree should have a file with name="Changed"
    When I open the Page Object with name="Changed"
    Then the Page Object should have name="Changed"
