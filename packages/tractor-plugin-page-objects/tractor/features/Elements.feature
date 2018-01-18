
Feature: Elements
  In order to describe a specific element of a part of a web application
  As a tractor user
  I want to be able to manipulate Elements within a Page Object file
  
Scenario: create Element
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create a new Page Object with name="With element"
    And I open the Page Object with name="With element"
    And I create an Element with name="element" and selector="selector"
    Then the page object should have an Element with name="element" and selector="selector"
  
Scenario: create Element group
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create a new Page Object with name="With element group"
    And I open the Page Object with name="With element group"
    And I create an Element group with name="element group" and selector="selector"
    Then the page object should have an Element group with name="element group" and selector="selector"
  
Scenario: create typed Element
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create a new Page Object with name="Type for element"
    And I create a new Page Object with name="With typed element"
    And I open the Page Object with name="With typed element"
    And I create an Element with name="typed element" and selector="selector" and type="Type for element"
    Then the page object should have an Element with name="typed element" and selector="selector" and type="Type for element"
  
Scenario: create typed Element group
    When I open the tractor application
    And I navigate to the Page Objects plugin
    And I create a new Page Object with name="Type for element group"
    And I create a new Page Object with name="With typed element group"
    And I open the Page Object with name="With typed element group"
    And I create an Element group with name="typed element group" and selector="selector" and type="Type for element group"
    Then the page object should have an Element group with name="typed element group" and selector="selector" and type="Type for element group"