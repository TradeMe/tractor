Feature: Access Tractor
  In order to to create E2E tests
  As a person who doesn't want to write JavaScript
  I want use tractor
  Scenario: Running tractor
    Given the default config
    When I go to the tractor URL
    Then I can see tractor running