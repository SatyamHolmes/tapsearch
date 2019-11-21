import { Component, OnInit } from '@angular/core';
import  PriorityQueue  from 'priorityqueue';
import  uuidv3  from "uuid/v3";
import  uuidv4  from "uuid/v4";
import { MatStepper } from '@angular/material/stepper';
import { PdfParserService } from './pdf-parser.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'tapsearch';
  namespace = uuidv4();
  enteredText = "";
  paraIdMap = {}; // mapping of each paragraph to their unique id
  wordParaMap = {}; // mapping of each word to priority queue containig list of paragraph ids arranged according to word frequency
  searchResult = [];

  constructor(private pdfParserService: PdfParserService) { }

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  private comparator(elem1, elem2) {
    return elem1.freq > elem2.freq ? 1 : elem1.freq < elem2.freq ? -1 : 0;
  }

  parseParagraph(): void {
    try {
      this.enteredText = this.enteredText.toLowerCase();
      this.enteredText.split('\n\n').forEach((para) => { // split by newline
        const id = uuidv3(para, this.namespace);
        this.paraIdMap[id] = para;
        const wordCount = {}; // to store the frequency of each word in the paragraph
          para.split(/[\s\(\)\[\]\{\}]/).forEach((word) => { // split each para by words and count the occurance of each word
            word = word.replace(/^[^\w]+/, "");
            word = word.replace(/[^\w]+$/, "");
            if (word.length != 0) {
              if (wordCount[word]) {
                wordCount[word]++;
              } else {
                wordCount[word] = 1;
              }
            }
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
    try {
      word = word.toLowerCase();
      word = word.trim();
      word = word.replace(/^[^\w]+/, "");
      word = word.replace(/[^\w]+$/, "");

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

  clear(stepper: MatStepper): void {
    this.paraIdMap = {};
    this.wordParaMap = {};
    this.searchResult = [];
    this.enteredText = "";
    stepper.previous();
  }

  onFileSelect(event: any): void {
    if (event.target.files[0]) {
      (<HTMLElement>document.querySelector('.busy')).style.display = "block";
      this.pdfParserService.convert(event.target.files[0]).subscribe(
        (res) => {
          if (!res.IsErroredOnProcessing) {
            this.enteredText = "";
            for (const item of res.ParsedResults) {
              this.enteredText += item.ParsedText.replace(/\.\r\n/g, ".\n\n")
            }
          } else {
            for(const item of res.ParsedResults) {
              console.log(item.ErrorMessage);
            }
          }
          (<HTMLElement>document.querySelector('.busy')).style.display = "none";
          event.target.value = "";
        },
        (err) => {
          console.log(err);
          (<HTMLElement>document.querySelector('.busy')).style.display = "none";
          event.target.value = "";
        }
      );
    }
  }

  generatePdf() {
    if (this.searchResult.length > 0) {
      const docDef = {content: this.searchResult.join('\n\n')};
      pdfMake.createPdf(docDef).download();
    }
  }
}
