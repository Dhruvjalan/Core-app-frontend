type assignedManagerId = {
  userId: string;
  _id:string
}
type Company = {
  _id: string;
  name: string;
  sector:string;
  dealStatus: string;
  assignedManagerId: assignedManagerId[];
  pocs: Array<any>;
  notes: string;
  mou: string;
  dealType: string;
  vertical: string;
  archived: boolean
};



export default Company;