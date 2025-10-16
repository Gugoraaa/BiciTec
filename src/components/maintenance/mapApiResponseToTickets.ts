import { Ticket } from "@/types/maintenance";
import { Report } from "@/types/report";
import { Status } from "@/types/maintenance";

export const mapApiResponseToTickets = (reports: Report[]): Ticket[] => {
  return reports.map((report) => {
    let status: Status;
    switch (report.estado) {
      case 'Open':
      case 'InProgress':
      case 'Done':
        status = report.estado === 'InProgress' ? 'InProgress' : report.estado;
        break;
      default:
        status = 'Open';
    }    
    return {
      id: report.id,
      bike: `Bike ${report.id_bici || 'N/A'}`,
      description: report.descripcion || 'No description provided',
      date: report.fecha_reporte ? new Date(report.fecha_reporte).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      priority: report.prioridad,
      status: report.estado,
    };
  });
};