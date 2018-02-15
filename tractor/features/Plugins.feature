
Feature: Plugins
  In order to extend tractor with additional functionality
  As a tester
  I want to be able to use tractor plugins

Scenario: Load plugins
    When I open the tractor application
    Then plugins have been loaded
