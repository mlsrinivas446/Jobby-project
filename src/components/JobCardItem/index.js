import {Link} from 'react-router-dom'
import {IoIosStar} from 'react-icons/io'
import {IoLocation} from 'react-icons/io5'
import {AiFillContacts} from 'react-icons/ai'

import './index.css'

const JobCardItem = props => {
  const {jobCardItem} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobCardItem
  return (
    <Link to={`jobs/${id}`} className="link">
      <li className="job-card-container">
        <div className="company-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-conatiner">
              <IoIosStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-salary-container">
          <div className="location-container">
            <div className="location-container">
              <IoLocation className="star-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="location-container">
              <AiFillContacts className="location-icon" />

              <p className="location">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="hr-card-line" />
        <h1 className="description-heading">Description</h1>
        <p className="description-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCardItem
