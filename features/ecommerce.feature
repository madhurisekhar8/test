Feature: ecommerce validations

  Scenario:  place an order
    Given a login to ecommerce application "username" and "password"
    When Add "Zara Coat 4" to cart
    Then verify "Zara Coat 4" is added to cart
    