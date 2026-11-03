import test from 'node:test';
import assert from 'node:assert/strict';
import { typingLessons, assessTypingEdit, nextTypingKey, typingAccuracy, typingStars, parseTypingProgress } from '../lib/typing-game.ts';

test('all lessons can be completed by typing one English key at a time', () => {
  assert.equal(typingLessons.length,4);
  for(const lesson of typingLessons){
    assert.equal(lesson.prompts.length,10);
    for(const target of lesson.prompts){
      let value='',attempts=0,mistakes=0;
      for(const char of target){const result=assessTypingEdit(value,value+char,target);assert.equal(result.issue,undefined);value=result.value;attempts+=result.attempts;mistakes+=result.mistakes;}
      assert.equal(value,target);assert.equal(attempts,target.length);assert.equal(typingAccuracy(attempts,mistakes),100);assert.equal(nextTypingKey(value,target),'');
    }
  }
});
test('mistakes require correction and remain in accuracy after Backspace',()=>{
  const bad=assessTypingEdit('c','cx','cat');assert.equal(bad.mistakes,1);assert.equal(nextTypingKey('cx','cat'),'Backspace');
  const deletion=assessTypingEdit('cx','c','cat');assert.equal(deletion.attempts,0);assert.equal(deletion.mistakes,0);
  const good=assessTypingEdit('c','ca','cat');assert.equal(good.attempts,1);assert.equal(good.mistakes,0);
  assert.equal(typingAccuracy(4,1),75);
});
test('selection replacement, spaces, Shift and punctuation are handled accurately',()=>{
  assert.deepEqual(assessTypingEdit('cxt','cat','cat'),{value:'cat',attempts:1,mistakes:0});
  assert.deepEqual(assessTypingEdit('cat','d','dog'),{value:'d',attempts:1,mistakes:0});
  assert.equal(nextTypingKey('','I can type.'),'I');assert.equal(nextTypingKey('I','I can type.'),' ');
  assert.equal(assessTypingEdit('','i','I can type.').mistakes,1);
  assert.equal(nextTypingKey('I can type','I can type.'),'.');
});
test('bulk paste, non-English input and overshooting do not advance or count attempts',()=>{
  for(const [before,after,target,issue] of [['','cat','cat','paste'],['','ក','cat','english'],['cat','cats','cat','length']]){
    assert.deepEqual(assessTypingEdit(before,after,target),{value:before,attempts:0,mistakes:0,issue});
  }
  assert.deepEqual(assessTypingEdit('cat','','cat'),{value:'',attempts:0,mistakes:0});
});
test('progress tolerates malformed storage and only preserves valid lesson stars',()=>{
  for(const raw of [null,'oops','null','[]'])assert.deepEqual(parseTypingProgress(raw),{});
  assert.deepEqual(parseTypingProgress('{"keys":3,"words":1,"school":999,"sentences":2.5,"other":3}'),{keys:3,words:1});
  assert.equal(typingStars(95),3);assert.equal(typingStars(80),2);assert.equal(typingStars(79),1);assert.equal(typingAccuracy(0,0),0);
});
