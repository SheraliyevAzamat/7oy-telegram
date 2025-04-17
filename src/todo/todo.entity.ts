
export class Todo {
    id: number;
    title: string;
    description: string;
    author: string;
    startDate: Date;
    endDate: Date;
  
    constructor(
      id: number,
      title: string,
      description: string,
      author: string,
      startDate: Date,
      endDate: Date,
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.author = author;
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }