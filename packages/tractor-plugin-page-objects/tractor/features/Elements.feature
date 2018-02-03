
Feature: Elements
  In order to describe a specific element of a part of a web application
  As a tractor user
  I want to be able to manipulate Elements within a Page Object file

Scenario: add Element
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="With element"
    And I add an Element with name="element" and selector="selector"
    And I save the Page Object
    Then the Page Object should have an Element with name="element" and selector="selector"

Scenario: add Element group
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="With element group"
    And I add an Element group with name="element group" and selector="selector"
    And I save the Page Object
    Then the Page Object should have an Element group with name="element group" and selector="selector"

Scenario: add typed Element
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Type for element"
    And I create and save a new Page Object with name="With typed element"
    And I add an Element with name="typed element" and selector="selector" and type="Type for element"
    And I save the Page Object
    Then the Page Object should have an Element with name="typed element" and selector="selector" and type="Type for element"

Scenario: add typed Element group
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Type for element group"
    And I create and save a new Page Object with name="With typed element group"
    And I add an Element group with name="typed element group" and selector="selector" and type="Type for element group"
    And I save the Page Object
    Then the Page Object should have an Element group with name="typed element group" and selector="selector" and type="Type for element group"

Scenario: Invalid name - required
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Element required name"
    And I add an Element with name="" and selector=""
    And I save the Page Object
    Then the Element name has as error="Required"

Scenario: Invalid name - valid identifier
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Element valid identifier name"
    And I add an Element with name="1" and selector="Selector"
    And I save the Page Object
    Then the Element name has as error="That is not a valid name"

Scenario: Invalid name - unique
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Element unique name"
    And I add an Element with name="Element" and selector="Selector"
    And I add an Element with name="Element" and selector="Selector"
    And I save the Page Object
    Then the Element name has as error="There is something else with the same name"

Scenario: Invalid selector - required
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Element required selector"
    And I add an Element with name="" and selector=""
    And I save the Page Object
    Then the Element selector has as error="Required"
