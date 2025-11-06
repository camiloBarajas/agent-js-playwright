/*
 *  Copyright 2021 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { test, expect } from '@playwright/test';
import {
  isFalse,
  isErrorLog,
  fileExists,
  promiseErrorHandler,
  calculateRpStatus,
} from '../utils';
import { STATUSES, TestOutcome } from '../constants';
import fs from 'fs';
import sinon from 'sinon';

// --- isFalse ---
test.describe('isFalse utility', () => {
  test('should return true for false and "false"', () => {
    expect(isFalse(false)).toBe(true);
    expect(isFalse('false')).toBe(true);
  });
  test('should return false for undefined and null', () => {
    expect(isFalse(undefined)).toBe(false);
    expect(isFalse(null as any)).toBe(false);
  });
});

// --- isErrorLog ---
test.describe('isErrorLog utility', () => {
  test('should return true if message contains "error" (case-insensitive)', () => {
    expect(isErrorLog('Some TEXT with ErRoR')).toBe(true);
  });
  test('should return false if message does not contain "error"', () => {
    expect(isErrorLog('Some text')).toBe(false);
  });
});

// --- fileExists ---
test.describe('fileExists utility', () => {
  test('should return true if file exists', async () => {
  const statStub = sinon.stub(fs.promises, 'stat').resolves({} as fs.Stats);
  const result = await fileExists('existing-file-path');
  expect(result).toBe(true);
  statStub.restore();
});
  test('should return false if file does not exist', async () => {
    const result = await fileExists('not-existing-file-path');
    expect(result).toBe(false);
  });
});

// --- promiseErrorHandler ---
test.describe('promiseErrorHandler utility', () => {
  test('should log error with empty message if not provided', async () => {
    let logged: any[] = [];
    const orig = console.error;
    console.error = (...args: any[]) => { logged = args; };
    await promiseErrorHandler(Promise.reject('error message'));
    expect(logged).toEqual(['', 'error message']);
    console.error = orig;
  });
  test('should log error with provided message', async () => {
    let logged: any[] = [];
    const orig = console.error;
    console.error = (...args: any[]) => { logged = args; };
    await promiseErrorHandler(Promise.reject('error message'), 'Failed to finish suite');
    expect(logged).toEqual(['Failed to finish suite', 'error message']);
    console.error = orig;
  });
  test('should not log anything if promise resolves', async () => {
    let called = false;
    const orig = console.error;
    console.error = () => { called = true; };
    await promiseErrorHandler(Promise.resolve(), 'Failed to finish suite');
    expect(called).toBe(false);
    console.error = orig;
  });
});

// --- calculateRpStatus ---
test.describe('calculateRpStatus utility', () => {
  test('should return FAILED for unknown outcome', () => {
    expect(calculateRpStatus('foo' as TestOutcome, 'interrupted', [])).toBe(STATUSES.FAILED);
  });
  test('should return PASSED for "expected" or "flaky" outcome', () => {
    expect(calculateRpStatus('expected', 'failed', [])).toBe(STATUSES.PASSED);
    expect(calculateRpStatus('flaky', 'failed', [])).toBe(STATUSES.PASSED);
  });
  test('should return SKIPPED for "skipped" outcome and "failed" status', () => {
    expect(calculateRpStatus('skipped', 'failed', [])).toBe(STATUSES.SKIPPED);
  });
  test('should return INTERRUPTED for "skipped" outcome and "interrupted" status', () => {
    expect(calculateRpStatus('skipped', 'interrupted', [])).toBe(STATUSES.INTERRUPTED);
  });
  test('should return FAILED for "unexpected" outcome and no "fail" annotations', () => {
    expect(calculateRpStatus('unexpected', 'failed', [])).toBe(STATUSES.FAILED);
  });
  test('should return FAILED for "unexpected" outcome, "fail" annotation and "passed" status', () => {
    expect(calculateRpStatus('unexpected', 'passed', [{ type: 'fail' }])).toBe(STATUSES.FAILED);
  });
  test('should return PASSED for "unexpected" outcome, "fail" annotation and "failed" status', () => {
    expect(calculateRpStatus('unexpected', 'failed', [{ type: 'fail' }])).toBe(STATUSES.PASSED);
  });
});