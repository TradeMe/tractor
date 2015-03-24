Feature: Open Component
  In order to modify a component that makes up a page
  As a tractor user
  I want to be able to open a component file
  Scenario: Open Component
    Given I have a saved component
    When I go to the Component Editor
    And I open a component
    Then that component should appear in the editor