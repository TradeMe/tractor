
Feature: Terminal
  In order to See what protractor is doing
  As a anyone
  I want to view the terminal within tractor

Scenario: Show and hide terminal
    When I open the tractor application
    And I show the terminal
    Then I can see the terminal
    When I close the terminal
    Then I cannot see the terminal
