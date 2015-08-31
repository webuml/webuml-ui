import Classifier = require('Classifier')
import PropertyId = require('PropertyId')
import AssociationView = require('../AssociationView')


export = Association;
class Association extends Classifier {

  ownedEnd:PropertyId[];
  memberEnd:PropertyId[];

  view:AssociationView;

  _links:any;
}
