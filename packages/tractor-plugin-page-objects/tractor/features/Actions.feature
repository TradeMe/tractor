
Feature: Actions
  In order to In order to describe a specific behaviours of a part of a web application
  As a tractor user
  I want to be able to manipulate Actions within a Page Object file

Scenario: add Action
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="With action"
    And I add an Action with name="action"
    And I set the argument with name="destination" to value="/"
    And I save the Page Object
    Then the Page Object should have an Action with name="action"
    And the Action should have an Interaction with element="Browser" and action="get"
    And the Interaction should set the Argument with name="destination" to value="/"

Scenario: add Action with parameters
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="With action with parameters"
    And I add an Action with name="action with parameters"
    And I add a Parameter with name="parameter"
    And I set the argument with name="destination" to value="parameter"
    And I save the Page Object
    Then the Page Object should have an Action with name="action with parameters"
    And the Action should have an Interaction with element="Browser" and action="get"
    And the Interaction should set the Argument with name="destination" to value="parameter"

Scenario: add Action on element
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="With action on element"
    And I add an Element with name="element" and selector="selector"
    And I add an Action with name="action with parameters"
    And I add a Parameter with name="parameter"
    And I set the Element for the Interaction to name="element"
    And I set the Action for the Interaction to name="send keys"
    And I set the argument with name="keys" to value="parameter"
    And I save the Page Object
    Then the Page Object should have an Action with name="action with parameters"
    And the Action should have an Interaction with element="element" and action="send keys"
    And the Interaction should set the Argument with name="keys" to value="parameter"

Scenario: Invalid name - required
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Action required name"
    And I add an Action with name=""
    And I save the Page Object
    Then the Action name has as error="Required"

Scenario: Invalid name - valid identifier
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Action valid identifier name"
    And I add an Action with name="1"
    And I save the Page Object
    Then the Action name has as error="That is not a valid name"

Scenario: Invalid name - unique
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Action unique name"
    And I add an Action with name="Action"
    And I add an Action with name="Action"
    And I save the Page Object
    Then the Action name has as error="There is something else with the same name"

Scenario: Invalid Parameter name - required
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Parameter required name"
    And I add an Action with name="Action"
    And I add a Parameter with name=""
    And I save the Page Object
    Then the Parameter name has as error="Required"

Scenario: Invalid Parameter name - valid identifier
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Parameter valid identifier name"
    And I add an Action with name="Action"
    And I add a Parameter with name="1"
    And I save the Page Object
    Then the Parameter name has as error="That is not a valid name"

Scenario: Invalid Parameter name - unique
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Parameter unique name"
    And I add an Action with name="Action"
    And I add a Parameter with name="Parameter"
    And I add a Parameter with name="Parameter"
    And I save the Page Object
    Then the Parameter name has as error="There is something else with the same name"

Scenario: Invalid Interaction Argument - required
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create and save a new Page Object with name="Interaction Argument required name"
    And I add an Action with name="Action"
    And I set the argument with name="destination" to value=""
    And I save the Page Object
    Then the Interaction Argument with the name="destination" has as error="Required"
