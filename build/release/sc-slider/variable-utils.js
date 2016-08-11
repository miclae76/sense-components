/**
 * @public
 * @todo Break out to a separate module (sense-extension-utils) since this code is re-used in several components.
 * @todo Units & integration tests
 * @todo Some renaming ("Engine" shouldn't be in the method names, quite obvious) - this is some kind of legacy thinking ...
 */
define(["angular","underscore"],function(angular,_){"use strict";var $injector=angular.injector(["ng"]),$q=$injector.get("$q"),varUtils=function(){var self=this;this.updateEngineVars=function(app,varDefs){var defer=$q.defer();return varDefs.forEach(function(varDef){_.isEmpty(varDef.name)?defer.resolve():self.ensureEngineVarExists(app,varDef.name).then(function(){app.variable.setContent(varDef.name,varDef.value).then(function(reply){})}).catch(function(err){})}),defer.promise},this.ensureEngineVarExists=function(app,varName){var defer=$q.defer();return this.engineVarExists(app,varName).then(function(result){return result?void defer.resolve(!0):self.createEngineSessionVar(app,varName)}).catch(function(err){defer.reject(err)}),defer.promise},this.createEngineSessionVar=function(app,varName){return app.variable.create({qName:varName})},this.engineVarExists=function(app,varName){var defer=$q.defer();return app.variable.getByName(varName).then(function(model){defer.resolve(model)},function(errorObject){defer.resolve(null)}),defer.promise},this.getEngineVarListValues=function(app,varList){if(varList&&Array.isArray(varList)){var promises=[];return varList.forEach(function(variable){_.isEmpty(variable)||promises.push(self.getEngineVarValue(app,variable))}),$q.all(promises)}return $q.reject(new Error("getEngineVarListValues variable list passed."))},this.getEngineVarValue=function(app,varName){var defer=$q.defer();return app.variable.getByName(varName).then(function(result){defer.resolve({success:!0,varName:varName,result:result})}).catch(function(err){defer.resolve({success:!1,varName:varName,err:err})}),defer.promise}};return new varUtils});