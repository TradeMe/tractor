
Feature: Search
  In order to easily navigate around while creating tests
  As a a tester
  I want to be able to search test files

Scenario: search results
    When I open the tractor application
    And I search for searchString="sea"
    And I go to the result with name="Search.feature"
    Then the feature file with name="Search" should be opened
