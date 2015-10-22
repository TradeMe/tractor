Feature: Component Editor
  In order to describe the behaviour of UI Components for my app
  As a person who wants to create Protractor tests
  I want to be able to edit Component files
  Scenario: Create Component
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I go to the Component Editor
    And I enter a Component name
    Given GET /components/file/path is a pass-through
    And PUT /components/file is a pass-through
    When I save a Component
    Then I can see that the Component was saved
  Scenario: Open Component
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I go to the Component Editor
    Given GET /components/file/path is a pass-through
    And GET /file?path is a pass-through
    When I open a Component
    Then I can see the Component in the Editor
  Scenario: Add Element
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I go to the Component Editor
    Given GET /components/file/path is a pass-through
    And GET /file?path is a pass-through
    When I open a Component
    And I create an Element
    Given PUT /components/file is a pass-through
    When I overwrite a Component
    And I go to the Feature Editor
    And I go to the Component Editor
    And I open a Component
    Then I can see the Element in the editor
