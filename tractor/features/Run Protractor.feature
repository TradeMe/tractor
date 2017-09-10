
Feature: Run Protractor
  In order to perform UI tests on an application without using the CLI
  As a anyone
  I want to be able to run Protractor from tractor
  
Scenario: Run Protractor
    When I open the tractor application
    When I run protractor with tag="All tests" and environment="http://localhost:4000"