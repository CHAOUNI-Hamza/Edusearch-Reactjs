import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';


function Doctorants() {
  const [users, setUsers] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newUserData, setNewUserData] = useState({
    CIN: '',
    APOGEE: '',
    NOM: '',
    PRENOM: '',
    date_inscription: '',
    nationalite: '',
    date_soutenance: '',
    sujet_these: '',
    user_id: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    axios.get('/users')
      .then(response => {
        setUserInfo(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching labo data!', error);
      });
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/doctorants');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const addUser = async () => {
    const { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id } = newUserData;
    if (!CIN || !APOGEE || !NOM || !PRENOM || !date_inscription || !nationalite || !date_soutenance || !sujet_these || !user_id )
    {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/admin/doctorants', { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id });
      fetchData();
      setNewUserData({
        CIN: '',
        APOGEE: '',
        NOM: '',
        PRENOM: '',
        date_inscription: '',
        nationalite: '',
        date_soutenance: '',
        sujet_these: '',
        user_id: '',
      });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
    } catch (error) {
      if (error.response && error.response.data.errorDate) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.response.data.errorDate,
        });
      } else {
        console.error('Error adding user:', error);
        setError('حدث خطأ أثناء الإضافة .');
      }
    }
  };
  

  const editUser = async () => {
    try {
      const { id, CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id } = editUserData;
      await axios.put(`/admin/doctorants/${id}`, { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث المعلومات بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
        if (error.response && error.response.data.errorDate) {
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: error.response.data.errorDate,
            });
          } else {
            console.error('Error updating user:', error);
            setError('حدث خطأ أثناء تحديث المعلومات .');
          }
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!"
      });

      if (result.isConfirmed) {
        await axios.delete(`/doctorants/${id}`);
        fetchData();
        Swal.fire({
          title: "تم الحذف!",
          text: "تم الحذف بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('حدث خطأ أثناء الحذف .');
    }
  };

  const openEditModal = (user) => {
    setEditUserData(user);
  };

  return (
    <div className="row font-arabic">
      <div className="col-12">
        <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
          إضافة
        </button>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title font-arabic p-2" style={{ float: 'right', borderBottom: 'none',
    paddingBottom: '0' }}>لائحة الطلبة</h3>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  <th>إجراءات</th>
                  <th>الأستاذ</th>
                  <th>الموضوع</th>
                  <th>تاريخ المناقشة</th>
                  <th>تاريخ التسجيل</th>
                  <th>الجنسية</th>
                  <th>رقم أبوجي</th>
                  <th>البطاقة الوطنية</th>
                  <th>النسب</th>
                  <th>الإسم</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                    </td>
                    <td>{user.user.nom} {user.user.prénom}</td>
                    <td>{user.sujet_these}</td>
                    <td>{user.date_soutenance}</td>
                    <td>{user.date_inscription}</td>
                    <td>{user.nationalite}</td>
                    <td>{user.APOGEE}</td>
                    <td>{user.CIN}</td>
                    <td>{user.NOM}</td>
                    <td>{user.PRENOM}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
          {/*<div className="card-footer clearfix">
            <ul className="pagination pagination-sm m-0 float-right">
              {Array.from({ length: lastPage }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>*/}
        </div>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="CIN">البطاقة الوطنية </label>
                  <input type="text" className="form-control" id="CIN" name="CIN" value={newUserData.CIN} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="APOGEE">رقم أبوجي </label>
                  <input type="text" className="form-control" id="APOGEE" name="APOGEE" value={newUserData.APOGEE} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="NOM">النسب </label>
                  <input type="text" className="form-control" id="NOM" name="NOM" value={newUserData.NOM} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="PRENOM">الإسم </label>
                  <input type="text" className="form-control" id="PRENOM" name="PRENOM" value={newUserData.PRENOM} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_inscription">تاريخ التسجيل </label>
                  <input type="date" className="form-control" id="date_inscription" name="date_inscription" value={newUserData.date_inscription} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="nationalite">الجنسية </label>
                  <input type="text" className="form-control" id="nationalite" name="nationalite" value={newUserData.nationalite} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_soutenance">تاريخ المناقشة </label>
                  <input type="date" className="form-control" id="date_soutenance" name="date_soutenance" value={newUserData.date_soutenance} onChange={handleNewUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="sujet_these">الموضوع </label>
                  <input type="text" className="form-control" id="sujet_these" name="sujet_these" value={newUserData.sujet_these} onChange={handleNewUserDataChange} />
                </div>
                <div className='form-group'>
                  <label htmlFor="user_id">الأستاذ</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={newUserData.user_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر</option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editUserData && ( 
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel"> تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="CIN">البطاقة الوطنية </label>
                  <input type="text" className="form-control" id="CIN" name="CIN" value={editUserData.CIN} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="APOGEE">رقم أبوجي </label>
                  <input type="text" className="form-control" id="APOGEE" name="APOGEE" value={editUserData.APOGEE} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="NOM">النسب </label>
                  <input type="text" className="form-control" id="NOM" name="NOM" value={editUserData.NOM} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="PRENOM">الإسم </label>
                  <input type="text" className="form-control" id="PRENOM" name="PRENOM" value={editUserData.PRENOM} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_inscription">تاريخ التسجيل </label>
                  <input type="date" className="form-control" id="date_inscription" name="date_inscription" value={editUserData.date_inscription} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="nationalite">الجنسية </label>
                  <input type="text" className="form-control" id="nationalite" name="nationalite" value={editUserData.nationalite} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_soutenance">تاريخ المناقشة </label>
                  <input type="date" className="form-control" id="date_soutenance" name="date_soutenance" value={editUserData.date_soutenance} onChange={handleEditUserDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="sujet_these">الموضوع </label>
                  <input type="text" className="form-control" id="sujet_these" name="sujet_these" value={editUserData.sujet_these} onChange={handleEditUserDataChange} />
                </div>

                <div className='form-group'>
                  <label htmlFor="user_id">صاحب المقال</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={editUserData.user_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر صاحب المقال</option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">إلغاء</button>
          <button type="button" className="btn btn-primary" onClick={editUser}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Doctorants;
