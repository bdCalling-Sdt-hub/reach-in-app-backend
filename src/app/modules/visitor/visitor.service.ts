import { Visitor } from "./visitor.model";

const visitorListFromDB = async (): Promise<{ visitorsArray: any[], totalSearching: number, dailySearching: number }> => {

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const visitorsArray = Array.from(
        { length: 12 },
        (_, i) => ({
            month: months[i],
            total: 0
        })
    );

    const today = new Date();
    const startTodayDate = new Date();
    startTodayDate.setDate(today.getDate() - 7);
    startTodayDate.setHours(0, 0, 0, 0);

    const endTodayDate = new Date();
    endTodayDate.setHours(23, 59, 59, 999);


    const visitorsAnalytics = await Visitor.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lt: endDate }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" }
                },
                total: { $sum: 1 }
            }
        }
    ]);

    // Update visitorsArray with the calculated statistics
    visitorsAnalytics.forEach((stat: any) => {
        const dayIndex = parseInt(stat._id.day) - 1;
        if (dayIndex < visitorsArray.length) {
            visitorsArray[dayIndex].total = stat.total;
        }
    });


    const [totalSearching, dailySearching] = await Promise.all([
        Visitor.countDocuments(),
        Visitor.countDocuments({
            createdAt: { $gte: startTodayDate, $lt: endTodayDate }
        } as any)
        
    ])

    return { visitorsArray,  totalSearching, dailySearching }
}

export const VisitorService = { visitorListFromDB }