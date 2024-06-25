import { User, Session } from '../app/connections/accounts.js'

beforeAll(async () => {})

afterAll(async () => {
  // drop the database
  User.collection.drop()
  Session.collection.drop()
})

beforeEach(async () => {})

afterEach(async () => {})
