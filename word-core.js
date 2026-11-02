'use strict';
(function(root){
const key=word=>word.toLowerCase().split('').sort().join('');
function shuffle(items,random=Math.random){const out=items.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function pool(bank,level,length){const choices=shuffle(bank.filter(x=>(level==='all'||x.difficulty===level)&&(length==='all'||x.word.length===Number(length))));return [...new Map(choices.map(x=>[key(x.word),x])).values()]}
function jumble(word,bank,random=Math.random){const valid=new Set(bank.filter(x=>key(x.word)===key(word)).map(x=>x.word));for(let i=0;i<60;i++){const text=shuffle(word.split(''),random).join('');if(!valid.has(text))return text}const letters=word.split('').sort();function search(prefix,rest){if(!rest.length)return valid.has(prefix)?null:prefix;for(let i=0;i<rest.length;i++){if(i&&rest[i]===rest[i-1])continue;const result=search(prefix+rest[i],rest.slice(0,i).concat(rest.slice(i+1)));if(result)return result}return null}return search('',letters)||word}
function create(entry){return {entry,points:10,attempt:1,hintUsed:false,wrong:[],ended:false,reason:null,earned:0}}
function guess(round,raw,bank){if(round.ended)return {round,outcome:'ended'};const text=raw.trim().toLowerCase();if(!text)return {round,outcome:'empty'};const answer=/^[a-z]+$/.test(text)&&bank.find(x=>x.word===text&&key(x.word)===key(round.entry.word));if(answer)return {round:{...round,entry:answer,ended:true,reason:'correct',earned:round.points},outcome:'correct'};const points=Math.max(0,round.points-1);return {round:{...round,points,attempt:round.attempt+1,wrong:round.wrong.concat({text,attempt:round.attempt}),ended:points===0,reason:points===0?'attempts':null},outcome:'wrong'}}
function hint(round){if(round.ended||round.hintUsed)return round;const points=Math.max(0,round.points-3);return {...round,points,hintUsed:true,ended:points===0,reason:points===0?'hint':null}}
const api=Object.freeze({key,shuffle,pool,jumble,create,guess,hint});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WordGameRules=api;
})(typeof window!=='undefined'?window:globalThis);
