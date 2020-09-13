import MimeType = GoogleAppsScript.Base.MimeType
import SpreadsheetApp = GoogleAppsScript.Spreadsheet.SpreadsheetApp;
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

export enum LogLebel {
    None,
    Debug,
    Trace,
    Info,
    Warn,
    Error
}

export class Logging {

    private lebel : LogLebel
    private ss : Spreadsheet
    private sheet : Sheet
    constructor(ss : Spreadsheet, lebel? : LogLebel) {
        this.lebel = lebel || LogLebel.Info
        this.ss = ss;
        this.sheet = ss.getActiveSheet()

    }

    private format(lebel : LogLebel, msg){
        if (this.lebel <= lebel){
            return this.sheet.appendRow([`[${new Date()}]`,`[${LogLebel[lebel]}]`,`${msg.toString()}`])
        } else {
            return
        }
    }

    static getNewLogger(name : string, level? : LogLebel): Logging{
        const file = this.getSpreadsheetByName(name);
        return new Logging(file, level);
    }

    debug(msg : string){
        this.format(LogLebel.Debug, msg)
    }

    trace(msg : string){
        this.format(LogLebel.Trace, msg)
    }

    info(msg : string){
        this.format(LogLebel.Info, msg)
    }

    warn(msg : string){
        this.format(LogLebel.Warn, msg)
    }

    error(msg : string){
        this.format(LogLebel.Error, msg)
    }

    static getSpreadsheetByName(name : string) : Spreadsheet{
        if(!name){
            return null;
        }

        let fileList = DriveApp.searchFiles('mimeType = "' + MimeType.GOOGLE_SHEETS + '"');
        let ss = null;

        while(fileList.hasNext()){
            let f = fileList.next();
            if(f.getName() == name){
                ss = SpreadsheetApp.open(f);
                break;
            }
        }

        if(null == ss){
            ss = SpreadsheetApp.create(name);
        }
        return ss;
    };
}

