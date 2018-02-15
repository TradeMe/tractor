
Feature: Mock Data file
  In order to describe some data for a mocked response
  As a tractor user
  I want to be able to manipulate Mock Data files

Scenario: Create Mock Data file
    When I open the tractor application
    And I navigate to the Mock Request plugin
    And I create and save new Mock Data with name="Mock"
    Then the file tree should have a file with name="Mock"
    And the file tree should show that the file with name="Mock" is unused
    When I open the Mock Data with name="Mock"
    Then the Mock Data should have name="Mock"

Scenario: Rename Mock Data file
    When I open the tractor application
    And I navigate to the Mock Request plugin
    And I create and save new Mock Data with name="Should be renamed"
    And I rename the Mock Data with name="Should be renamed" to newName="Changed"
    Then the file tree should have a file with name="Changed"
    When I open the Mock Data with name="Changed"
    Then the Mock Data should have name="Changed"

Scenario: Invalid name - required
    When I open the tractor application
    And I navigate to the Mock Request plugin
    When I create and save new Mock Data with name=""
    Then the Mock Data name has an error="Required"
