#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('object', DIR, async (ctx) => {
  let s = ctx.step('Create object diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/object/diagrams', { name: 'Test Object' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create object (user1)');
  let obj1Id;
  try {
    const res = await apiPost('/api/object/objects', { diagramId, name: 'user1:User', x1: 50, y1: 50, x2: 200, y2: 120 });
    obj1Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Add slot to user1');
  try {
    await apiPost(`/api/object/objects/${encId(obj1Id)}/slots`, { name: 'name = "Alice"' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create object (order1)');
  let obj2Id;
  try {
    const res = await apiPost('/api/object/objects', { diagramId, name: 'order1:Order', x1: 350, y1: 50, x2: 500, y2: 120 });
    obj2Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Add slot to order1');
  try {
    await apiPost(`/api/object/objects/${encId(obj2Id)}/slots`, { name: 'total = 100' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create link: user1 → order1');
  try {
    await apiPost('/api/object/links', { diagramId, sourceId: obj1Id, targetId: obj2Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export object image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/object/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
