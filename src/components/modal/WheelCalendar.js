import { CloseIcon } from '@/utils/icons';
import moment from 'moment';
import { useState } from 'react';
import DatePicker from 'react-mobile-datepicker';
import { Button } from '../button/Button';
import { useTranslations } from 'next-intl';
const dateConfig = {
  'date': {
    format: 'DD',
    caption: 'Day',
    step: 1,
  },
  'month': {
    format: value => moment(value).format("MMM"),
    caption: 'Mon',
    step: 1,
  },
  'year': {
    format: 'YYYY',
    caption: 'Year',
    step: 1,
  },
}

const WheelCalendar = ({ setCalendarValue, setShowDate, defaultActiveStartDate }) => {
  const t = useTranslations("sign_up");
  const [calendar, setCalendar] = useState(defaultActiveStartDate)

  const handleSelect = () => {
    setCalendarValue(calendar);
    setShowDate(false);
  }

  const handleChange = (e) => {
    setCalendar(e)
  }

  return (
    <div className='signUpModal loginFrom'>
      <div className='signUpModalClose'>
        <CloseIcon onClick={() => setShowDate(false)} />
      </div>
      <DatePicker
        value={calendar}
        isOpen={true}
        dateConfig={dateConfig}
        showHeader={true}
        showFooter={false}
        onChange={handleChange}
        customHeader={t("date_of_birth")}
      />
      <Button
        onClick={handleSelect}
        className="btnPrimary calendarConfirm"
        text={t("save")} />
    </div>
  );
};

export default WheelCalendar;
