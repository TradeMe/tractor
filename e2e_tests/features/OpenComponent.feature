Feature: OpenComponent
  In order to modify a component that makes up a page
  As a tractor user
  I want to be able to open a component file
  Scenario: Open Component
    Given I am using the Component Editor
    When I open a component
    Then that component should appear in the editor