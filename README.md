# brainn-api
brainn.co hiring proccess challenge.
An API to get and classify by tags user's Github repos

## Quickstart
  - Clone this repository
  ```
    $ git clone https://github.com/prxg22/brainn-api.git
  ```

  - Install dependencies
  ```
    $ npm i
  ```

  - Start development enviroment
  ```
    $ npm start
  ```

# Other options
 1. Test
 ```
  $ npm test
 ```
 or
 ```
  $ npm run test:watch
 ```

 2. Generate documentation
 ```
  $ npm run docs
 ```

 4. Build proccess
 ```
  $ npm run build
 ```

## API Reference
  ## Modules

<dl>
<dt><a href="#module_API">API</a></dt>
<dd></dd>
<dt><a href="#module_libs/APIError">libs/APIError</a></dt>
<dd></dd>
<dt><a href="#module_libs/Route">libs/Route</a></dt>
<dd></dd>
<dt><a href="#Route.module_User">User</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#jwtSecret">jwtSecret</a> : <code>string</code></dt>
<dd><p>JWT secret word to generate tokens</p>
</dd>
<dt><a href="#expiration">expiration</a> : <code>number</code></dt>
<dd><p>Expiration time to tokens</p>
</dd>
<dt><a href="#saltRounds">saltRounds</a> : <code>number</code></dt>
<dd><p>Bcrypt salt rounds for password and tokens generation</p>
</dd>
<dt><a href="#passwordLength">passwordLength</a> : <code>number</code></dt>
<dd><p>Min password length</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#hashPassword">hashPassword(password)</a> ⇒ <code>string</code></dt>
<dd><p>Hash password</p>
</dd>
<dt><a href="#comparePassword">comparePassword(password, hashed)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true/false if password is equal the hashed.</p>
</dd>
<dt><a href="#authenticate">authenticate(obj)</a> ⇒ <code>string</code></dt>
<dd><p>Generates JWT token from obj</p>
</dd>
<dt><a href="#authorize">authorize(password, hashed)</a> ⇒ <code>boolean</code> | <code>Object</code></dt>
<dd><p>Checks if token is valid and returns stored object</p>
</dd>
<dt><a href="#authorizeMiddleware">authorizeMiddleware(req, res, next)</a> ⇒ <code>void</code></dt>
<dd><p>Checks if token is valid and returns stored object</p>
</dd>
<dt><a href="#register">register(data)</a> ⇒ <code>UserModel</code></dt>
<dd><p>Creates user and return it</p>
</dd>
<dt><a href="#authenticate">authenticate(data)</a> ⇒ <code>UserModel</code></dt>
<dd><p>Authenticates user and returns JWT token which should be
transported in future requests</p>
</dd>
</dl>

<a name="module_API"></a>

## API
**Author**: Paulo Ricardo Xavier Giusti  
<a name="external_Express"></a>

### API~Express
The Express namespace.

**Kind**: inner external of [<code>API</code>](#module_API)  
**See**: [Express](https://github.com/expressjs/express)  
<a name="module_libs/APIError"></a>

## libs/APIError
**Author**: Paulo Ricardo Xavier Giusti  

* [libs/APIError](#module_libs/APIError)
    * [APIError](#exp_module_libs/APIError--APIError) ⇐ <code>Error</code> ⏏
        * [new APIError(label)](#new_module_libs/APIError--APIError_new)
        * _instance_
            * [.errorHandler](#module_libs/APIError--APIError+errorHandler)
            * [.setAPIErrors](#module_libs/APIError--APIError+setAPIErrors)
        * _inner_
            * [~APIErrorsMap](#module_libs/APIError--APIError..APIErrorsMap) : <code>Array.&lt;APIErrorDescription&gt;</code> ℗
            * [~APIErrorDescription](#module_libs/APIError--APIError..APIErrorDescription) : <code>Object</code>

<a name="exp_module_libs/APIError--APIError"></a>

### APIError ⇐ <code>Error</code> ⏏
Represents an API error with HTTP status code

**Kind**: Exported class  
**Extends**: <code>Error</code>  
<a name="new_module_libs/APIError--APIError_new"></a>

#### new APIError(label)

| Param | Type | Description |
| --- | --- | --- |
| label | <code>string</code> | Label to be found on [APIErrorsMap](APIErrorsMap) |

<a name="module_libs/APIError--APIError+errorHandler"></a>

#### apiError.errorHandler
Error handler middleware

**Kind**: instance property of [<code>APIError</code>](#exp_module_libs/APIError--APIError)  

| Param | Type |
| --- | --- |
| error | <code>APIError</code> \| <code>Error</code> | 
| req | <code>Express.Request</code> | 
| res | <code>Express.Response</code> | 
| [next] | <code>Express.Next</code> | 

<a name="module_libs/APIError--APIError+setAPIErrors"></a>

#### apiError.setAPIErrors
Opens file in `path` and stores an array of [APIErrorDescription](APIErrorDescription)

**Kind**: instance property of [<code>APIError</code>](#exp_module_libs/APIError--APIError)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path to JSON document which contain the [APIErrorDescription](APIErrorDescription) array |

<a name="module_libs/APIError--APIError..APIErrorsMap"></a>

#### APIError~APIErrorsMap : <code>Array.&lt;APIErrorDescription&gt;</code> ℗
Array of objects

**Kind**: inner property of [<code>APIError</code>](#exp_module_libs/APIError--APIError)  
**Access**: private  
<a name="module_libs/APIError--APIError..APIErrorDescription"></a>

#### APIError~APIErrorDescription : <code>Object</code>
API error description type

**Kind**: inner typedef of [<code>APIError</code>](#exp_module_libs/APIError--APIError)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> | Error msg |
| httpCode | <code>number</code> | Response HTTP status code |

<a name="module_libs/Route"></a>

## libs/Route
**Author**: Paulo Ricardo Xavier Giusti  

* [libs/Route](#module_libs/Route)
    * [Route](#exp_module_libs/Route--Route) ⏏
        * [new Route(router)](#new_module_libs/Route--Route_new)
        * _instance_
            * [.init()](#module_libs/Route--Route+init) ⇒ <code>void</code>
        * _inner_
            * [~setRoute(baseRoute, router, routeDescription)](#module_libs/Route--Route..setRoute) ⇒ <code>void</code> ℗
            * [~setActions(router, actionDescription)](#module_libs/Route--Route..setActions) ⇒ <code>void</code> ℗
            * [~setAction(router, action)](#module_libs/Route--Route..setAction) ⇒ <code>void</code> ℗
            * [~ActionDescription](#module_libs/Route--Route..ActionDescription)
            * [~RouteDescription](#module_libs/Route--Route..RouteDescription)

<a name="exp_module_libs/Route--Route"></a>

### Route ⏏
Describes API route.
You should not instaciate this class. It should be extended by your routes.

**Kind**: Exported class  
<a name="new_module_libs/Route--Route_new"></a>

#### new Route(router)

| Param | Type | Description |
| --- | --- | --- |
| router | <code>external:Express#Router</code> | router in which route will be used |

<a name="module_libs/Route--Route+init"></a>

#### route.init() ⇒ <code>void</code>
Set route actions on router

**Kind**: instance method of [<code>Route</code>](#exp_module_libs/Route--Route)  
**Throws**:

- <code>Error</code> if `this.route` is invalid

<a name="module_libs/Route--Route..setRoute"></a>

#### Route~setRoute(baseRoute, router, routeDescription) ⇒ <code>void</code> ℗
Set a route on router

**Kind**: inner method of [<code>Route</code>](#exp_module_libs/Route--Route)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| baseRoute | <code>String</code> | Route's base path |
| router | <code>external:Express#Router</code> | API router |
| routeDescription | <code>RouteDescription</code> | [RouteDescription](RouteDescription) |

<a name="module_libs/Route--Route..setActions"></a>

#### Route~setActions(router, actionDescription) ⇒ <code>void</code> ℗
Set a route on router

**Kind**: inner method of [<code>Route</code>](#exp_module_libs/Route--Route)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| router | <code>external:Express#Router</code> | API router |
| actionDescription | <code>ActionDescription</code> | [ActionDescription](ActionDescription) |

<a name="module_libs/Route--Route..setAction"></a>

#### Route~setAction(router, action) ⇒ <code>void</code> ℗
Set a route on router

**Kind**: inner method of [<code>Route</code>](#exp_module_libs/Route--Route)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| router | <code>external:Express#Router</code> | API router |
| action | <code>external:Express#Middleware</code> \| <code>Array.&lt;external:Express#Middleware&gt;</code> |  |

<a name="module_libs/Route--Route..ActionDescription"></a>

#### Route~ActionDescription
Describes an route action

**Kind**: inner typedef of [<code>Route</code>](#exp_module_libs/Route--Route)  

| Param | Type | Description |
| --- | --- | --- |
| <HTTP_METHOD> | <code>String</code> | Action HTTP method |
| action | <code>external:Express#Middleware</code> \| <code>Array.&lt;external:Express#Middleware&gt;</code> | Array of or callback to be called on route |

<a name="module_libs/Route--Route..RouteDescription"></a>

#### Route~RouteDescription
Describes a route with your methods and actions

**Kind**: inner typedef of [<code>Route</code>](#exp_module_libs/Route--Route)  

| Param | Type | Description |
| --- | --- | --- |
| <ROUTE_PATH> | <code>String</code> | Route path with paramaters |
| actionDescription | <code>ActionDescription</code> |  |

<a name="Route.module_User"></a>

## User
**Author**: Paulo Ricardo Xavier Giusti  

* [User](#Route.module_User)
    * [~register(req, res, next)](#Route.module_User..register) ⇒ <code>void</code>
    * [~login(req, res, next)](#Route.module_User..login) ⇒ <code>void</code>

<a name="Route.module_User..register"></a>

### User~register(req, res, next) ⇒ <code>void</code>
User registration route

**Kind**: inner method of [<code>User</code>](#Route.module_User)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>express.Request</code> | Express http request |
| res | <code>express.Response</code> | Express http response |
| next | <code>express.Next</code> | Express next function |

<a name="Route.module_User..login"></a>

### User~login(req, res, next) ⇒ <code>void</code>
User logins route

**Kind**: inner method of [<code>User</code>](#Route.module_User)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>express.Request</code> | Express http request |
| res | <code>express.Response</code> | Express http response |
| next | <code>express.Next</code> | Express next function |

<a name="jwtSecret"></a>

## jwtSecret : <code>string</code>
JWT secret word to generate tokens

**Kind**: global constant  
<a name="expiration"></a>

## expiration : <code>number</code>
Expiration time to tokens

**Kind**: global constant  
<a name="saltRounds"></a>

## saltRounds : <code>number</code>
Bcrypt salt rounds for password and tokens generation

**Kind**: global constant  
<a name="passwordLength"></a>

## passwordLength : <code>number</code>
Min password length

**Kind**: global constant  
<a name="hashPassword"></a>

## hashPassword(password) ⇒ <code>string</code>
Hash password

**Kind**: global function  
**Returns**: <code>string</code> - hashed password  
**Throws**:

- <code>APIError</code> If no passowrd is given

**Expose**:   

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to be hashed |

<a name="comparePassword"></a>

## comparePassword(password, hashed) ⇒ <code>boolean</code>
Returns true/false if password is equal the hashed.

**Kind**: global function  
**Expose**:   

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to be checked |
| hashed | <code>string</code> | Hasehd password |

<a name="authenticate"></a>

## authenticate(obj) ⇒ <code>string</code>
Generates JWT token from obj

**Kind**: global function  
**Returns**: <code>string</code> - JWT token  
**Expose**:   

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>string</code> | Object to be transported |

<a name="authorize"></a>

## authorize(password, hashed) ⇒ <code>boolean</code> \| <code>Object</code>
Checks if token is valid and returns stored object

**Kind**: global function  
**Expose**:   

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to be checked |
| hashed | <code>string</code> | Hasehd password |

<a name="authorizeMiddleware"></a>

## authorizeMiddleware(req, res, next) ⇒ <code>void</code>
Checks if token is valid and returns stored object

**Kind**: global function  
**Expose**:   

| Param | Type | Description |
| --- | --- | --- |
| req | <code>express.Request</code> | Express http request |
| res | <code>express.Response</code> | Express http response |
| next | <code>express.Next</code> | Express next function |

<a name="register"></a>

## register(data) ⇒ <code>UserModel</code>
Creates user and return it

**Kind**: global function  
**Throws**:

- <code>APIError</code> if username has already been used

**Expose**:   

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="authenticate"></a>

## authenticate(data) ⇒ <code>UserModel</code>
Authenticates user and returns JWT token which should be
transported in future requests

**Kind**: global function  
**Throws**:

- <code>APIError</code> if username has already been used

**Expose**:   

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

