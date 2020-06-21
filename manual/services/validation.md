# Validation Service

A service provides an easy way to validate inputs. It was built on the `validatorjs` package.

## Usage

You can use this service using this way.

```javascript
// controllers/HomeController.js

import Controller from "dotapp/controller";
import { Validator } from "dotapp/services";

export default class extends Controller {
	async index(req, res) {
		let validation = Validator.make(req.all(), {
			first_name: "required|min:2",
			last_name: "required|min:2",
			password: "required|min:7",
		});

		if (validation.fails()) {
			return res.validationError(validation.errors.all());
		}

		return res.ok("All inputs valid");
	}
}
```

You can register a new validation rule.

```javascript
// controllers/HomeController.js

import Controller from "dotapp/controller";
import { Validator } from "dotapp/services";
import User from "~/models/user";

export default class extends Controller {
	async index(req, res) {
		Validator.registerAsync(
			"email_available",
			async (email, attribute, req, passes) => {
				let user = await User.where("email", email).findOne();
				return user ? passes(false, req.lang("user.email_taken")) : passes();
			}
		);

		let validation = new Validator(req.all(), {
			email: "required|email|email_available",
		});

		// you must the .validate() method as we add Async operation
		// validate() method return a promise that resolve a boolean value

		if (await validation.failsAsync()) {
			return res.validationError(validation.errors.all());
		}

		return res.ok("All inputs valid");
	}
}
```

## Available Rules

#### `required`

The field under validation must be exist.

#### `accepted`

The field under validation must be yes, on, 1 or true. This is useful for validating "Terms of Service" acceptance.

#### `after:date`

The field under validation must be after the given date.

#### `after_or_equal:date`

The field unter validation must be after or equal to the given field

#### `alpha`

The field under validation must be entirely alphabetic characters.

#### `alpha_dash`

The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### `alpha_num`

The field under validation must be entirely alpha-numeric characters.

#### `array`

The field under validation must be an array.

#### `before:date`

The field under validation must be before the given date.


#### `before_or_equal:date`

The field under validation must be before or equal to the given date.

#### `between:min,max`

The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in the same fashion as the size rule.

#### `boolean`

The field under validation must be a boolean value of the form `true`, `false`, `0`, `1`, `'true'`, `'false'`, `'0'`, `'1'`,

#### `confirmed`

The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation field must be present in the input.

#### `date`

The field under validation must be a valid date format which is acceptable by Javascript's `Date` object.

#### `digits:value`

The field under validation must be numeric and must have an exact length of value.

#### `digits_between:min,max`

The field under validation must be numeric and must have length between given min and max.

#### `different:attribute`

The given field must be different than the field under validation.

#### `email`

The field under validation must be formatted as an e-mail address.

#### `hex`
The field under validation should be a hexadecimal format. Useful in combination with other rules, like `hex|size:6` for hex color code validation.

#### `in:foo,bar,...`

The field under validation must be included in the given list of values. The field can be an array or string.

#### `integer`

The field under validation must have an integer value.

#### `max:value`

Validate that an attribute is no greater than a given size

_Note: Maximum checks are inclusive._

#### `min:value`

Validate that an attribute is at least a given size.

_Note: Minimum checks are inclusive._

#### `not_in:foo,bar,...`

The field under validation must not be included in the given list of values.

#### `numeric`

Validate that an attribute is numeric. The string representation of a number will pass.

#### `present`
The field under validation must be present in the input data but can be empty.

#### `required`

Checks if the length of the String representation of the value is >

#### `required_if:anotherfield,value`

The field under validation must be present and not empty if the anotherfield field is equal to any value.

#### `required_unless:anotherfield,value`

The field under validation must be present and not empty unless the anotherfield field is equal to any value.

#### `required_with:foo,bar,...`

The field under validation must be present and not empty only if any of the other specified fields are present.

#### `required_with_all:foo,bar,...`

The field under validation must be present and not empty only if all of the other specified fields are present.

#### `required_without:foo,bar,...`

The field under validation must be present and not empty only when any of the other specified fields are not present.

#### `required_without_all:foo,bar,...`

The field under validation must be present and not empty only when all of the other specified fields are not present.

#### `same:attribute`

The given field must match the field under validation.

#### `size:value`

The field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value.

#### `string`

The field under validation must be a string.

#### `url`

Validate that an attribute has a valid URL format

---
## Error Messages

#### `first(attribute)`

returns the first error message for an attribute, false otherwise

#### `get(attribute)`

returns an array of error messages for an attribute, or an empty array if there are no errors

#### `all()`

returns an object containing all error messages for all failing attributes

#### `has(attribute)`

returns true if error messages exist for an attribute, false otherwise


---
## Methods:

#### `passes()`

    @return boolean

    check for a valid operation.

#### `passesAsync()`

    @return promise

    check for a valid operation which uses an async rule.

#### `fails()`

    @return boolean

    check for an invalid operation.

#### `failsAsync()`

    @return promise

    check for invalid operation which uses an async rule.

#### `register(name, callbackFn, errorMessage)` [static]

    @return void

    create a new validator rule.

    name {String} - The name of the rule.

    callbackFn {Function} - Returns a boolean to represent a successful or failed validation.

    errorMessage {String} - An optional string where you can specify a custom error message. :attribute inside errorMessage will be replaced with the attribute name.

```javascript
Validator.register(
	"telephone",
	(value, requirement, attribute) => {
		// requirement parameter defaults to null
		return value.match(/^\d{3}-\d{3}-\d{4}$/);
	},
	"The :attribute phone number is not in the format XXX-XXX-XXXX."
);
```

#### `registerAsync(name, callbackFn, errorMessage)` [static]

    @return void

    create a new validator async rule.

```javascript
Validator.registerAsync(
	"username_available",
	(username, attribute, req, passes) => {
		// do your database/api checks here etc
		// then call the `passes` method where appropriate:
		passes(); // if username is available
		passes(false, "Username has already been taken."); // if username is not available
	}
);
```

---

Reference: https://github.com/skaterdav85/validatorjs
