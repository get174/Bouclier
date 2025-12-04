# TODO: Fix ObjectId Constructor Error in Repairs

## Completed Tasks
- [x] Identified the error: TypeError: Class constructor ObjectId cannot be invoked without 'new' at backend/routes/repairs.js:57:32
- [x] Fixed ObjectId instantiation in POST /repairs route by adding 'new' keyword
- [x] Fixed ObjectId instantiation in GET /repairs/building route by adding 'new' keyword

## Next Steps
- [ ] Test the repair creation functionality to ensure the fix works
- [ ] Verify no other ObjectId issues in the codebase
