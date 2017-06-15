const test = require('tape')
const kue = require('kue')

let queue

test('create queue', (t) => {
  queue = kue.createQueue({
    prefix: 'test-shutdown',
    redis: {
      host: 'localhost',
      port: 6379,
    },
  })
  t.end()
})

test('enqueue', (t) => {
  // don't block
  queue
    .create('job-type', { foo: 'bar' })
    .save((err) => {
      t.ok(!!err)
      console.error(err)
    })
  t.end()
})

test('shutdown queue', (t) => {
  queue.shutdown(0, (err) => {
    t.error(err)
    t.end()
  })
})

test('the process will not exit :(', (t) => {
  t.end()
})