import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import AxiosClient from '../../shared/plugins/axios';
import { Loading } from '../../shared/components/Loading';
import { FilterComponent } from '../../shared/components/FilterComponent';
import { ButtonCircle } from '../../shared/components/ButtonCircle';
import { CategoryForm } from './components/CategoryForm';
import { EditCategoryForm } from './components/EditCategoryForm';
import Alert, {
  confirmMsj,
  confirmTitle,
  errorMsj,
  errorTitle,
  successMsj,
  successTitle,
} from '../../shared/plugins/alerts';

const options = {
  rowsPerPageText: 'Registros por página',
  rangeSeparatorText: 'de',
};

export const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name &&
      category.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: '/category/' });
      if (!data.error) {
        setCategories(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      // Poner alerta de error
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const enableOrDisable = (category) =>
    Alert.fire({
      title: confirmTitle,
      text: confirmMsj,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        category.status = !category.status;
        try {
          const response = await AxiosClient({
            method: 'PATCH',
            url: '/category/',
            data: JSON.stringify(category),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsj,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            });
          }
          return response;
        } catch (error) {
          Alert.fire({
            title: errorTitle,
            text: errorMsj,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });
        } finally {
          getCategories();
        }
      },
    });

  const headerComponent = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) setFilterText('');
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText]);

  const columns = React.useMemo(() => [
    {
      name: '#',
      cell: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: 'Categoría',
      cell: (row) => <div>{row.name}</div>,
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: 'Estado',
      cell: (row) =>
        row.status ? (
          <Badge bg="success">Activo</Badge>
        ) : (
          <Badge bg="danger">Inactivo</Badge>
        ),
      sortable: true,
      selector: (row) => row.status,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <>
          <ButtonCircle
            icon="edit"
            type={'btn btn-outline-warning btn-circle me-2'}
            size={16}
            onClick={() => {
              setIsEditing(true);
              setSelectedCategory(row);
            }}
          />
          {row.status ? (
            <ButtonCircle
              icon="trash-2"
              type={'btn btn-outline-danger btn-circle'}
              onClick={() => enableOrDisable(row)}
              size={16}
            />
          ) : (
            <ButtonCircle
              icon="pocket"
              type={'btn btn-outline-success btn-circle'}
              size={16}
              onClick={() => enableOrDisable(row)}
            />
          )}
        </>
      ),
    },
  ]);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>Categorías</Col>
          <Col className="text-end">
            <ButtonCircle
              type={' btn btn-success btn-circle'}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
            <CategoryForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setCategories={setCategories}
            />
            {selectedCategory && (
              <EditCategoryForm
                isOpen={isEditing}
                onClose={() => {
                  setIsEditing(false);
                  setSelectedCategory(null);
                }}
                setCategories={setCategories}
                category={selectedCategory}
              />
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={filteredCategories}
          progressPending={isLoading}
          progressComponent={<Loading />}
          noDataComponent={'Sin registros'}
          pagination
          paginationComponentOptions={options}
          subHeader
          subHeaderComponent={headerComponent}
          persistTableHead
          striped={true}
          highlightOnHover={true}
        />
      </Card.Body>
    </Card>
  );
};
