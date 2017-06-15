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

test('killing process after 20s if not exited yet', (t) => {
  // since we call .unref(), the process will exit
  // if the timeout is the only thing left in event loop
  setTimeout(() => {
    t.fail('Process did not automatically shutdown')
    process.exit(0)
  }, 20 * 1000).unref()
  t.end()
})