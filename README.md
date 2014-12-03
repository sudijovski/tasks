tasks
=====

AngularJS Couch


CouchDb proceducers

1. Create three databases: users, tasks, project

Create new document in users:
{
   "_id": "admin",
   "password": "admin",
   "isAdmin": true,
   "fullName": "The Admin",
   "email": "test@test.com"
}

2. Create new document in tasks (this will be the view):
{
   "_id": "_design/tasks",
   "language": "javascript",
   "views": {
       "byProject": {
           "map": "function(doc) {\nif(doc.project) {\n  emit(doc.project, doc._id);\n}\n}"
       },
       "byAssignee": {
           "map": "function(doc) {\nif(doc.assignee) {\n  emit(doc.assignee, doc._id);\n}\n}"
       }
   }
}

3. You are good to go
