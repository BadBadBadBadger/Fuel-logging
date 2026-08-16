Feature: Premium account avatar — Google profile picture with fallback

  Scenario: Premium user with a Google profile picture
    Given I am signed in as a premium user with a profile picture
    Then the header shows my Google profile photo
    And the image request is sent with no referrer so it is not blocked

  Scenario: Profile picture fails to load
    Given I am a premium user whose profile image fails to load
    Then the avatar falls back to the first letter of my name in the accent colour
    And no broken-image icon is shown

  Scenario: Premium user without a picture
    Given I am a premium user with no profile picture
    Then the avatar shows the first letter of my name in the accent colour

  Scenario: Tapping the avatar opens sign-out
    Given I am a premium user
    When I tap the avatar in the header
    Then the sign-out confirmation modal opens
