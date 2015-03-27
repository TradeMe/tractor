Feature: Modify Directory Structure
  In order to organise my tractor files better
  As a a user with a lot of tractor files
  I want to be able to add and remove directories
  Scenario: Add new directory
    Given the default config
    Given I do not have existing component data
    Given that add-directory is a pass through
    When I go to the Component Editor
    When I add a new directory
    Then I see a new directory