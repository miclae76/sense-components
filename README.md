# sense-components

> Components to be used (in Widgets) in Qlik Sense.

## Components

- [Alert (`sc-alert`)](#alert-sc-alert)
- [Get Variable Values (`sc-get-variables`)](#get-variable-values-sc-get-variables)
- [Progressbar (`sc-progressbar`)](#progressbar-sc-progressbar)
- [Slider (`sc-slider`)](#slider-sc-slider)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Alert (`sc-alert`)

> Render a simple, customizable alert.

### Usage

```html
<sc-alert closable="true" auto-close-after="10">This is the alert message</sc-alert>
<sc-alert closable="true" design="warning">This is the alert message</sc-alert>
```

### Properties

* **`closable`** _{boolean}_ - Whether the alert should be closable or not. _(Default: false)_

* **`auto-close-after`** _{numeric}_ - Define the amount of milliseconds after which the alert should be automatically hidden.
* **`type`** _{string}_ - Defines the style of the component using Leonardo UI classes.
Possible values: `info`, `success`, `warning`, `danger`

### Screenshots

![](docs/images/qw-alert--screenshot.png)

## Get Variable Values (`sc-get-variables`)

> A simple custom component to fetch the value of one or more variables.

### Usage

```html
<sc-get-variables content="vVar1,vVar2">
    
    // Now the value of the two variables are available in the scope's 
    // object `variables`
    
    <b>List of variable values:</b>
    <ul style="margin-left:20px;">
        <li ng-repeat="variable in variables">
            <b>{{variable.varName}}:</b> {{variable.qContent.qString}}
        </li>
    </ul>
    
</sc-get-variables>
```

### Properties

* **`content`** _{string}_ - Comma separated list of variables to be loaded.

<!--## Minichart (sc-minichart)

### Properties

* **``** _{}_ - _(Default: )_

* **``** _{}_ - _(Default: )_

* **``** _{}_ - _(Default: )_

* **``** _{}_ - _(Default: )_

* **``** _{}_ - _(Default: )_

-->

## Progressbar (`sc-progressbar`)

> Progressbar component.

### Basic Example

**_Html:_**

```html
<sc-progressbar max="100" value="50">50%</sc-progressbar>
```

**_Result:_**

![](docs/images/component_wiProgressbar_BasicExample.png)

### Properties

* **`max`** _{number}_ - A number that specifies the total value of bars that is required. _(Default: 100)_

* **`value`**  _{number}_ - The current value of progress completed.
* **`type`** _{string}_ - Chosen design. Possible values are `primary`, `info`, `success`, `warning`, `danger`, `inverse` _(Default: null)_

* **`animate`** _{boolean}_ - Whether bars use transitions to achieve the width change. _(Default: true)_

#### Example Using All Properties

```html
<sc-progressbar 
    max="100" 
    value="50" 
    animate="true" 
    design="danger">50%
</sc-progressbar>
```

### Stacked Progressbar

If you want to add multiple bars into the same progressbar you can create a stacked progessbar:

**_Html:_**

```html
<sc-progressbar>
    <sc-progress>
        <sc-bar value="20" design="danger">20%</sc-bar>
        <sc-bar value="10" design="success">10%</sc-bar>
        <sc-bar value="60" design="info">60%</sc-bar>
    </sc-progress>
</sc-progressbar>
```

**_Result:_**

> ![](docs/images/component_wiProgressbar_StackedProgressbar.png)

### Design Types

Examples how a progressbar would look like depending on the chosen `design`:

> ![](docs/images/component_wiProgressbar_Types.png)

## Slider (`sc-slider`)

### Properties

General properties:

* **`slider-type`** _{string}_ - The type of the Slider - `single` or `range`. _(Default: `single`)_

* **`min`** _{number}_ - The minimum value of the Slider. _(Default: 0)_

* **`max`** _{number}_ - The maximum value of the Slider._(Default: 100)_

* **``** _{}_ - _(Default: )_

Properties for type `single`:

* **`start`** _{number}_ - The start position for the handle (if using type `single`). _(Default: ?)_

* **`qs-var`** _{}_ - _(Default: )_

Properties for type `range`:

* **`start-lower`** _{number}_ - The start position for the lower/left handle (if using type `range`). _(Default: 0)_

* **`start-upper`** _{}_ - The start position for the upper/right handle (if using type `range`). _(Default: 100)_

* **`qs-var-lower`** _{}_ - _(Default: )_

* **`qs-var-upper`** _{}_ - _(Default: )_

<!--false-->
<!--false-->

<!--

### [Alert component](src/sc-alert/sc-alert.js#L26)

Render an alert in different colors within Qlik Sense.

**Params**

* `closable` **{boolean}**: Whether the alert should be closable or not.
* `autoCloseAfter` **{number}**: If defined and greater than zero, the alert automatically hides after the value defined in milliseconds.
* `type` **{string}**: Chosen design. Possible values are `primary`, `info`, `success`, `warning`, `danger`, `inverse`. _(Default: null)_

-->