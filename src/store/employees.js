import axios from 'axios';

export const get = async (props) => {
    // console.log('props', props);

    const { data } = await axios.post(process.env.EMPLOYEE_GET, {
        "dskEntry": 1,
    });

    // console.log('data', data);

    return data.empList;
}