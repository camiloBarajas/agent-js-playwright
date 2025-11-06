import { test, expect } from '@playwright/test';
import helpers from '@reportportal/client-javascript/lib/helpers';
import { ReportingApi } from '../reportingApi';
import * as utils from '../utils';
import { LOG_LEVELS } from '../constants';
import { mockedDate } from '../mocks/RPClientMock';

test.describe('ReportingApi integration (Playwright)', () => {
  test.beforeAll(() => {
    helpers.now = () => mockedDate;
  });

  test('addAttributes should call sendEventToReporter with params', async () => {
    const attrs = [{ key: 'key', value: 'value' }];
    const suite = 'suite';
    const event = 'rp:addAttributes';
    let called = false;
    let args: any[] = [];
    const original = utils.sendEventToReporter;
    // @ts-ignore
    utils.sendEventToReporter = (...a: any[]) => { /* mock */ };
    ReportingApi.addAttributes(attrs, suite);
    expect(called).toBeTruthy();
    expect(args).toEqual([event, attrs, suite]);
    // @ts-ignore
    utils.sendEventToReporter = original;
  });

  test('setDescription should call sendEventToReporter with params', async () => {
    const description = 'description';
    const suite = 'suite';
    const event = 'rp:setDescription';
    let called = false;
    let args: any[] = [];
    const original = utils.sendEventToReporter;
    // @ts-ignore
    utils.sendEventToReporter = (...a: any[]) => { called = true; args = a; };
    ReportingApi.setDescription(description, suite);
    expect(called).toBeTruthy();
    expect(args).toEqual([event, description, suite]);
    // @ts-ignore
    utils.sendEventToReporter = original;
  });

  test('setTestCaseId should call sendEventToReporter with params', async () => {
    const testCaseId = 'TestCaseIdForTheSuite';
    const suite = 'suite';
    const event = 'rp:setTestCaseId';
    let called = false;
    let args: any[] = [];
    const original = utils.sendEventToReporter;
    // @ts-ignore
    utils.sendEventToReporter = (...a: any[]) => { called = true; args = a; };
    ReportingApi.setTestCaseId(testCaseId, suite);
    expect(called).toBeTruthy();
    expect(args).toEqual([event, testCaseId, suite]);
    // @ts-ignore
    utils.sendEventToReporter = original;
  });

  test('setStatusPassed should call sendEventToReporter with "passed" status', async () => {
    const suite = 'suite';
    const event = 'rp:setStatus';
    let called = false;
    let args: any[] = [];
    const original = utils.sendEventToReporter;
    // @ts-ignore
    utils.sendEventToReporter = (...a: any[]) => { called = true; args = a; };
    ReportingApi.setStatusPassed(suite);
    expect(called).toBeTruthy();
    expect(args).toEqual([event, 'passed', suite]);
    // @ts-ignore
    utils.sendEventToReporter = original;
  });

  test('ReportingApi.log should call sendEventToReporter with params', async () => {
    const event = 'rp:addLog';
    const file = {
      name: 'filename',
      type: 'image/png',
      content: Buffer.from([1, 2, 3, 4, 5, 6, 7]).toString('base64'),
    };
    const suite = 'suite';
    const expectedData = {
      file,
      level: 'INFO',
      message: 'message',
      time: mockedDate,
    };
    let called = false;
    let args: any[] = [];
    const original = utils.sendEventToReporter;
    // @ts-ignore
    utils.sendEventToReporter = (...a: any[]) => { called = true; args = a; };
    ReportingApi.log(LOG_LEVELS.INFO, 'message', file, suite);
    expect(called).toBeTruthy();
    expect(args).toEqual([event, expectedData, suite]);
    // @ts-ignore
    utils.sendEventToReporter = original;
  });
});