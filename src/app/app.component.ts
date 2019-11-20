import { Component } from '@angular/core';
import  PriorityQueue  from 'priorityqueue';
import  uuidv3  from "uuid/v3";
import  uuidv4  from "uuid/v4";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tapsearch';
  namespace = uuidv4();
  paraIdMap = {}; // mapping of each paragraph to their unique id
  wordParaMap = {}; // mapping of each word to priority queue containig list of paragraph ids arranged according to word frequency
  searchResult = [];

  private comparator(elem1, elem2) {
    return elem1.freq > elem2.freq ? 1 : elem1.freq < elem2.freq ? -1 : 0;
  }

  parseParagraph(text: string): void {
    console.log(text);
    try {
      text = text.toLowerCase();
      text.split('\n\n').forEach((para) => { // split by newline
        const id = uuidv3(para, this.namespace);
        this.paraIdMap[id] = para;
        const wordCount = {}; // to store the frequency of each word in the paragraph
        para.split('.').forEach((sentence) => {
          sentence.split(' ').forEach((word) => { // split each para by words and count the occurance of each word
            if (wordCount[word]) {
              wordCount[word]++;
            } else {
              wordCount[word] = 1;
            }
          });
        });
        // store the map of word count and id of paragraph in priority queue of hashmap
        Object.entries(wordCount).forEach((elem) => {
          if (!this.wordParaMap[elem[0]]) {
            this.wordParaMap[elem[0]] = new PriorityQueue({comparator: this.comparator});
          }
          this.wordParaMap[elem[0]].push(Object.assign({}, {id, freq: elem[1]}));
        });
      });
    } catch (err) {
      console.log(err);
    };
  } 

  getParagraphs(word: string): void {
    console.log(this.wordParaMap);
    try {
      word = word.toLowerCase();
      if (this.wordParaMap[word]) {
        const paraids = [];
        while (this.wordParaMap[word].length && paraids.length < 10) {
          paraids.push(this.wordParaMap[word].pop());
        }

        for (let i=0; i < paraids.length; i++) {
          this.wordParaMap[word].push(paraids[i]);
        }

        const paragraphs = [];
        for (let i=0; i < paraids.length; i++) {
          paragraphs.push(this.paraIdMap[paraids[i].id]);
        }
        this.searchResult = paragraphs;
      } else {
        this.searchResult = [];
      }
      console.log(this.searchResult);
    } catch (err) {
      console.log(err);
    }
  }

  clear(): void {
    this.paraIdMap = {};
    this.wordParaMap = {};
    this.searchResult = [];
  }
}
